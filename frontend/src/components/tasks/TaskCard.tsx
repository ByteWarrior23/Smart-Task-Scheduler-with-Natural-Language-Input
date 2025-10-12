import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '@/types/api';
import { Badge } from '@/components/common/Badge';
import { formatDate, getDeadlineStatus, formatDuration } from '@/utils/date';
import {
  ClockIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChatBubbleLeftIcon,
  FireIcon,
  BoltIcon,
  ArrowPathIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import { cn } from '@/utils/cn';

interface TaskCardProps {
  task: Task;
  onToggleStatus?: (taskId: string, completed: boolean) => void;
  onArchive?: (taskId: string) => void;
}

const priorityConfig = {
  low: {
    gradient: 'from-green-400 to-emerald-500',
    shadow: 'shadow-green-500/30',
    icon: null,
    border: 'border-green-400',
  },
  medium: {
    gradient: 'from-blue-400 to-cyan-500',
    shadow: 'shadow-blue-500/30',
    icon: null,
    border: 'border-blue-400',
  },
  high: {
    gradient: 'from-orange-400 to-yellow-500',
    shadow: 'shadow-orange-500/30',
    icon: BoltIcon,
    border: 'border-orange-400',
  },
  urgent: {
    gradient: 'from-red-500 to-pink-600',
    shadow: 'shadow-red-500/40',
    icon: FireIcon,
    border: 'border-red-500',
  },
} as const;

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleStatus, onArchive }) => {
  const deadlineStatus = getDeadlineStatus(task.deadline);
  const isCompleted = task.status === 'completed';
  const config = priorityConfig[task.priority];
  const PriorityIcon = config.icon;

  return (
    <div
      className={cn(
        'group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700',
        'hover:-translate-y-1 hover:scale-[1.02]',
        isCompleted && 'opacity-75'
      )}
    >
      {/* Priority indicator bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-1 bg-gradient-to-r', config.gradient)}></div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={() => onToggleStatus?.(task._id, !isCompleted)}
              className="mt-1 flex-shrink-0 group/check"
            >
              {isCompleted ? (
                <CheckCircleSolid className="h-6 w-6 text-green-600 dark:text-green-500 transition-transform group-hover/check:scale-110" />
              ) : (
                <CheckCircleIcon className="h-6 w-6 text-gray-400 hover:text-green-600 dark:hover:text-green-500 transition-colors group-hover/check:scale-110" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <Link to={`/tasks/${task._id}`} className="group/link">
                <h3
                  className={cn(
                    'text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover/link:text-primary-600 dark:group-hover/link:text-primary-400 transition-colors',
                    isCompleted && 'line-through text-gray-500 dark:text-gray-400'
                  )}
                >
                  {task.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {task.description}
              </p>
            </div>
          </div>

          {/* Priority Badge */}
          <div className={cn('flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r', config.gradient, config.shadow, 'shadow-lg')}>
            {PriorityIcon && <PriorityIcon className="h-3 w-3" />}
            {task.priority.toUpperCase()}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {task.deadline && (
            <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700', deadlineStatus.isOverdue && 'bg-red-100 dark:bg-red-900/30')}>
              <CalendarIcon className={cn('h-4 w-4', deadlineStatus.color)} />
              <span className={cn('font-medium', deadlineStatus.color)}>
                {formatDate(task.deadline)}
              </span>
            </div>
          )}
          
          {task.time_required && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <ClockIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {formatDuration(task.time_required)}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {task.category && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                <TagIcon className="h-3 w-3" />
                <span className="text-xs font-medium">{task.category}</span>
              </div>
            )}
            {task.recurring && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                <ArrowPathIcon className="h-3 w-3" />
                <span className="text-xs font-medium">Recurring</span>
              </div>
            )}
          </div>

          {task.comments.length > 0 && (
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
              <ChatBubbleLeftIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{task.comments.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <div className={cn('absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none', config.gradient)}></div>
    </div>
  );
};
