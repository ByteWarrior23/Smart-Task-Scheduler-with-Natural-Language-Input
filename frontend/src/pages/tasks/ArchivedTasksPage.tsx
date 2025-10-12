import React from 'react';
import { useTasks } from '@/hooks/useTasks';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';

export const ArchivedTasksPage: React.FC = () => {
  const { data: tasks, isLoading } = useTasks({ archived: true });

  if (isLoading) {
    return <Loading fullScreen text="Loading archived tasks..." />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Archived Tasks</h1>

      {tasks && tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ArchiveBoxIcon className="h-12 w-12" />}
          title="No archived tasks"
          description="Archived tasks will appear here"
        />
      )}
    </div>
  );
};
