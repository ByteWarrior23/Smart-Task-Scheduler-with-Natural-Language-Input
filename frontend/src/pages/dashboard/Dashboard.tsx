import React, { useState } from 'react';
import { useTasks, useReminderStats } from '@/hooks/useTasks';
import { TaskCard } from '@/components/tasks/TaskCard';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { EmptyState } from '@/components/common/EmptyState';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { VoiceInputModal } from '@/components/tasks/VoiceInputModal';
import { RecurringTaskModal } from '@/components/tasks/RecurringTaskModal';
import { useToggleTaskStatus } from '@/hooks/useTasks';
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MicrophoneIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const { data: tasks, isLoading } = useTasks({ archived: false });
  const { data: reminderStats } = useReminderStats();
  const toggleStatus = useToggleTaskStatus();

  const pendingTasks = tasks?.filter(t => t.status === 'pending') || [];
  const completedTasks = tasks?.filter(t => t.status === 'completed') || [];
  const urgentTasks = pendingTasks.filter(t => t.priority === 'urgent');

  const stats = [
    {
      name: 'Total Tasks',
      value: tasks?.length || 0,
      icon: ClipboardDocumentListIcon,
      color: 'bg-primary-500',
    },
    {
      name: 'Pending',
      value: pendingTasks.length,
      icon: ClockIcon,
      color: 'bg-warning-500',
    },
    {
      name: 'Completed',
      value: completedTasks.length,
      icon: CheckCircleIcon,
      color: 'bg-success-500',
    },
    {
      name: 'Urgent',
      value: urgentTasks.length,
      icon: ExclamationTriangleIcon,
      color: 'bg-danger-500',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's your task overview
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => setIsVoiceModalOpen(true)}
            leftIcon={<MicrophoneIcon className="h-5 w-5" />}
          >
            Voice
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsRecurringModalOpen(true)}
            leftIcon={<ArrowPathIcon className="h-5 w-5" />}
          >
            Recurring
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<PlusIcon className="h-5 w-5" />}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            🔥 Urgent Tasks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleStatus={(id, completed) =>
                  toggleStatus.mutate({ taskId: id, completed })
                }
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Recent Tasks
        </h2>
        {tasks && tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.slice(0, 9).map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onToggleStatus={(id, completed) =>
                  toggleStatus.mutate({ taskId: id, completed })
                }
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ClipboardDocumentListIcon className="h-12 w-12" />}
            title="No tasks yet"
            description="Create your first task to get started"
            action={
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Task
              </Button>
            }
          />
        )}
      </div>

      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <VoiceInputModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />
      <RecurringTaskModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
      />
    </div>
  );
};
