import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask, useUpdateTask, useDeleteTask, useToggleTaskStatus, useAddComment } from '@/hooks/useTasks';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Loading } from '@/components/common/Loading';
import { TextArea } from '@/components/common/TextArea';
import { formatDateTime, formatDuration } from '@/utils/date';
import { ArrowLeftIcon, TrashIcon, PencilIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export const TaskDetailPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState('');
  
  const { data: task, isLoading } = useTask(taskId!);
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();
  const toggleStatus = useToggleTaskStatus();
  const addComment = useAddComment();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask.mutateAsync(taskId!);
      navigate('/tasks');
    }
  };

  const handleAddComment = async () => {
    if (comment.trim()) {
      await addComment.mutateAsync({ taskId: taskId!, comment });
      setComment('');
    }
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading task..." />;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={<ArrowLeftIcon className="h-4 w-4" />}>
        Back
      </Button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {task.title}
            </h1>
            <div className="flex items-center space-x-2">
              <Badge variant={task.status === 'completed' ? 'success' : 'warning'}>
                {task.status}
              </Badge>
              <Badge variant={task.priority === 'urgent' ? 'danger' : task.priority === 'high' ? 'warning' : 'primary'}>
                {task.priority}
              </Badge>
              {task.category && <Badge variant="gray">{task.category}</Badge>}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={() => toggleStatus.mutate({ taskId: task._id, completed: task.status !== 'completed' })}>
              <CheckCircleIcon className="h-5 w-5" />
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-lg font-semibold mb-2">Description</h2>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{task.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-6">
          {task.deadline && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Deadline</h3>
              <p className="text-gray-900 dark:text-gray-100 mt-1">{formatDateTime(task.deadline)}</p>
            </div>
          )}
          {task.time_required && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</h3>
              <p className="text-gray-900 dark:text-gray-100 mt-1">{formatDuration(task.time_required)}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</h3>
            <p className="text-gray-900 dark:text-gray-100 mt-1">{formatDateTime(task.createdAt)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated</h3>
            <p className="text-gray-900 dark:text-gray-100 mt-1">{formatDateTime(task.updatedAt)}</p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-lg font-semibold mb-4">Comments ({task.comments.length})</h2>
          <div className="space-y-3 mb-4">
            {task.comments.map((comment, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <p className="text-gray-700 dark:text-gray-300">{comment}</p>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <TextArea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
            />
            <Button onClick={handleAddComment} loading={addComment.isPending}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
