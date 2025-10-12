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
import { useAuth } from '@/context/AuthContext';
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  MicrophoneIcon,
  ArrowPathIcon,
  FireIcon,
  SparklesIcon,
  BoltIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

export const Dashboard: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const { data: tasks, isLoading } = useTasks({ archived: false });
  const { data: reminderStats } = useReminderStats();
  const toggleStatus = useToggleTaskStatus();
  const { user } = useAuth();

  const pendingTasks = tasks?.filter(t => t.status === 'pending') || [];
  const completedTasks = tasks?.filter(t => t.status === 'completed') || [];
  const urgentTasks = pendingTasks.filter(t => t.priority === 'urgent');
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'high');
  const todayTasks = pendingTasks.filter(t => {
    if (!t.deadline) return false;
    const deadline = new Date(t.deadline);
    const today = new Date();
    return deadline.toDateString() === today.toDateString();
  });

  const completionRate = tasks && tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  const stats = [
    {
      name: 'Total Tasks',
      value: tasks?.length || 0,
      icon: ClipboardDocumentListIcon,
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/50',
      change: '+12%',
      changeType: 'increase' as const,
    },
    {
      name: 'Pending',
      value: pendingTasks.length,
      icon: ClockIcon,
      gradient: 'from-orange-500 to-yellow-500',
      shadowColor: 'shadow-orange-500/50',
      change: '-5%',
      changeType: 'decrease' as const,
    },
    {
      name: 'Completed',
      value: completedTasks.length,
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-emerald-500',
      shadowColor: 'shadow-green-500/50',
      change: '+23%',
      changeType: 'increase' as const,
    },
    {
      name: 'Completion Rate',
      value: `${completionRate}%`,
      icon: ChartBarIcon,
      gradient: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/50',
      change: '+8%',
      changeType: 'increase' as const,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loading size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 shadow-2xl animate-gradient bg-[length:200%_200%]">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-3">
                {getGreeting()}, {user?.fullname?.split(' ')[0] || user?.username}!
                <span className="animate-float">👋</span>
              </h1>
              <p className="text-xl text-white/90">
                You have {pendingTasks.length} pending {pendingTasks.length === 1 ? 'task' : 'tasks'} today.
                {urgentTasks.length > 0 && (
                  <span className="inline-flex items-center gap-1 ml-2">
                    <FireIcon className="h-5 w-5 animate-pulse" />
                    {urgentTasks.length} urgent!
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => setIsVoiceModalOpen(true)}
                variant="secondary"
                size="lg"
                leftIcon={<MicrophoneIcon className="h-5 w-5" />}
                className="btn-shine bg-white hover:bg-gray-50 text-primary-600"
              >
                Voice Input
              </Button>
              <Button
                onClick={() => setIsRecurringModalOpen(true)}
                variant="secondary"
                size="lg"
                leftIcon={<ArrowPathIcon className="h-5 w-5" />}
                className="btn-shine bg-white hover:bg-gray-50 text-primary-600"
              >
                Recurring
              </Button>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                size="lg"
                leftIcon={<PlusIcon className="h-6 w-6" />}
                className="btn-shine bg-white text-primary-600 hover:bg-gray-50"
              >
                New Task
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.name}
            className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} ${stat.shadowColor} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`text-sm font-semibold ${stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {stat.change}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      {(urgentTasks.length > 0 || todayTasks.length > 0 || reminderStats?.overdue) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {urgentTasks.length > 0 && (
            <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg shadow-red-500/50 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <FireIcon className="h-8 w-8 animate-pulse" />
                <span className="text-3xl font-bold">{urgentTasks.length}</span>
              </div>
              <h3 className="text-lg font-semibold">Urgent Tasks</h3>
              <p className="text-sm text-white/80 mt-1">Requires immediate attention</p>
            </div>
          )}
          {todayTasks.length > 0 && (
            <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <BoltIcon className="h-8 w-8" />
                <span className="text-3xl font-bold">{todayTasks.length}</span>
              </div>
              <h3 className="text-lg font-semibold">Due Today</h3>
              <p className="text-sm text-white/80 mt-1">Don't forget these tasks</p>
            </div>
          )}
          {reminderStats?.overdue > 0 && (
            <div className="bg-gradient-to-br from-orange-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/50 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <ExclamationTriangleIcon className="h-8 w-8 animate-bounce-slow" />
                <span className="text-3xl font-bold">{reminderStats.overdue}</span>
              </div>
              <h3 className="text-lg font-semibold">Overdue</h3>
              <p className="text-sm text-white/80 mt-1">Past deadline</p>
            </div>
          )}
        </div>
      )}

      {/* Urgent Tasks Section */}
      {urgentTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
              <FireIcon className="h-8 w-8 text-red-500 animate-pulse" />
              Urgent Tasks
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-red-500 to-transparent rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentTasks.slice(0, 3).map((task, index) => (
              <div key={task._id} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up">
                <TaskCard
                  task={task}
                  onToggleStatus={(id, completed) =>
                    toggleStatus.mutate({ taskId: id, completed })
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-white">
              <SparklesIcon className="h-7 w-7 text-primary-500" />
              Recent Tasks
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-primary-500 to-transparent rounded"></div>
          </div>
          {tasks && tasks.length > 9 && (
            <Button variant="ghost" onClick={() => window.location.href = '/tasks'}>
              View All →
            </Button>
          )}
        </div>
        
        {tasks && tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.slice(0, 9).map((task, index) => (
              <div key={task._id} style={{ animationDelay: `${index * 50}ms` }} className="animate-scale-in">
                <TaskCard
                  task={task}
                  onToggleStatus={(id, completed) =>
                    toggleStatus.mutate({ taskId: id, completed })
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 border-2 border-dashed border-gray-300 dark:border-gray-700">
            <EmptyState
              icon={<ClipboardDocumentListIcon className="h-16 w-16 text-primary-500" />}
              title="No tasks yet"
              description="Start by creating your first task using the button above or try voice input!"
              action={
                <div className="flex gap-3">
                  <Button onClick={() => setIsCreateModalOpen(true)} leftIcon={<PlusIcon className="h-5 w-5" />}>
                    Create Task
                  </Button>
                  <Button variant="secondary" onClick={() => setIsVoiceModalOpen(true)} leftIcon={<MicrophoneIcon className="h-5 w-5" />}>
                    Try Voice Input
                  </Button>
                </div>
              }
            />
          </div>
        )}
      </div>

      {/* Modals */}
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
