import React from 'react';
import { useTasks, useReminderStats } from '@/hooks/useTasks';
import { ChartBarIcon } from '@heroicons/react/24/outline';

export const AnalyticsPage: React.FC = () => {
  const { data: tasks } = useTasks();
  const { data: reminderStats } = useReminderStats();

  const stats = {
    total: tasks?.length || 0,
    completed: tasks?.filter(t => t.status === 'completed').length || 0,
    pending: tasks?.filter(t => t.status === 'pending').length || 0,
    byPriority: {
      urgent: tasks?.filter(t => t.priority === 'urgent').length || 0,
      high: tasks?.filter(t => t.priority === 'high').length || 0,
      medium: tasks?.filter(t => t.priority === 'medium').length || 0,
      low: tasks?.filter(t => t.priority === 'low').length || 0,
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</h3>
          <p className="text-3xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 dark:text-gray-400">Completed</h3>
          <p className="text-3xl font-bold mt-2 text-success-600">{stats.completed}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 dark:text-gray-400">Pending</h3>
          <p className="text-3xl font-bold mt-2 text-warning-600">{stats.pending}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</h3>
          <p className="text-3xl font-bold mt-2">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Tasks by Priority</h2>
        <div className="space-y-3">
          {Object.entries(stats.byPriority).map(([priority, count]) => (
            <div key={priority} className="flex items-center justify-between">
              <span className="capitalize">{priority}</span>
              <div className="flex items-center space-x-2">
                <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${priority === 'urgent' ? 'bg-danger-500' : priority === 'high' ? 'bg-warning-500' : priority === 'medium' ? 'bg-primary-500' : 'bg-success-500'}`}
                    style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
