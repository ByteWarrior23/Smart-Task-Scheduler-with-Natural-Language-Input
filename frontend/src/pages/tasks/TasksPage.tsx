import React, { useState } from 'react';
import { useTasks, useToggleTaskStatus, useDeleteTask } from '@/hooks/useTasks';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { PlusIcon, MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { SearchParams, TaskPriority, TaskStatus } from '@/types/api';

export const TasksPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState<SearchParams>({ archived: false });
  const [search, setSearch] = useState('');
  
  const { data: tasks, isLoading } = useTasks(filters);
  const toggleStatus = useToggleTaskStatus();
  const deleteTask = useDeleteTask();

  const filteredTasks = tasks?.filter(task => 
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">All Tasks</h1>
        <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<PlusIcon className="h-5 w-5" />}>
          New Task
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
          />
          <Select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as TaskStatus })}
            options={[
              { value: '', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'completed', label: 'Completed' },
            ]}
          />
          <Select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value as TaskPriority })}
            options={[
              { value: '', label: 'All Priorities' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' },
            ]}
          />
          <Input
            placeholder="Category"
            value={filters.category || ''}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loading size="lg" text="Loading tasks..." />
        </div>
      ) : filteredTasks && filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onToggleStatus={(id, completed) => toggleStatus.mutate({ taskId: id, completed })}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No tasks found"
          description="Create your first task or adjust your filters"
          action={<Button onClick={() => setIsCreateModalOpen(true)}>Create Task</Button>}
        />
      )}

      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  );
};
