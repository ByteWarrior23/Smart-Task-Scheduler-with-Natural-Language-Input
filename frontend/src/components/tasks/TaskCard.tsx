import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '@/types/api';
import { Badge } from '@/components/common/Badge';
import { formatDate, getDeadlineStatus, formatDuration } from '@/utils/date';
import {
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  ArchiveBoxIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { cn } from '@/utils/cn';

interface TaskCardProps {
  task: Task;
  onToggleStatus?: (taskId: string, completed: boolean) => void;
  onArchive?: (taskId: string) => void;
}

const priorityColors = {
  low: 'success',
  medium: 'primary',
  high: 'warning',
  urgent: 'danger',
} as const;

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleStatus, onArchive }) => {
  const deadlineStatus = getDeadlineStatus(task.deadline);
  const isCompleted = task.status === 'completed';

  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border-l-4',
      task.priority === 'urgent' && 'border-danger-500',
      task.priority === 'high' && 'border-warning-500',
      task.priority === 'medium' && 'border-primary-500',
      task.priority === 'low' && 'border-success-500',
      isCompleted && 'opacity-75'
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleStatus?.(task._id, !isCompleted)}
            className="mt-1 flex-shrink-0"
          >
            {isCompleted ? (
              <CheckCircleSolid className="h-5 w-5 text-success-600" />
            ) : (
              <CheckCircleIcon className="h-5 w-5 text-gray-400 hover:text-success-600" />
            )}
          </button>
          <div className="flex-1 min-w-0">
            <Link to={`/tasks/${task._id}`}>
              <h3 className={cn(
                'text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-500',
                isCompleted && 'line-through'
              )}>
                {task.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">
              {task.description}
            </p>
          </div>
        </div>
        <Badge variant={priorityColors[task.priority]} size="sm">
          {task.priority.toUpperCase()}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
        {task.deadline && (
          <div className="flex items-center space-x-1">
            <CalendarIcon className="h-4 w-4" />
            <span className={deadlineStatus.color}>{formatDate(task.deadline)}</span>
          </div>
        )}
        {task.time_required && (
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>{formatDuration(task.time_required)}</span>
          </div>
        )}
        {task.category && (
          <Badge variant="gray" size="sm">{task.category}</Badge>
        )}
        {task.comments.length > 0 && (
          <div className="flex items-center space-x-1">
            <ChatBubbleLeftIcon className="h-4 w-4" />
            <span>{task.comments.length}</span>
          </div>
        )}
        {task.recurring && (
          <Badge variant="primary" size="sm">Recurring</Badge>
        )}
      </div>
    </div>
  );
};
