import React, { useState } from 'react';
import { useRecurringTasks } from '@/hooks/useTasks';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export const RecurringTasksPage: React.FC = () => {
  const { data: tasks, isLoading } = useRecurringTasks();

  if (isLoading) {
    return <Loading fullScreen text="Loading recurring tasks..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Recurring Tasks</h1>
        <Button leftIcon={<PlusIcon className="h-5 w-5" />}>New Recurring Task</Button>
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ArrowPathIcon className="h-12 w-12" />}
          title="No recurring tasks"
          description="Create recurring tasks for repeating activities"
        />
      )}
    </div>
  );
};
