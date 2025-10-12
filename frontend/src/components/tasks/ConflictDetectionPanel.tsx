import React from 'react';
import { ExclamationTriangleIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { formatDateTime } from '@/utils/date';

interface ConflictingTask {
  taskId: string;
  title: string;
  start: string;
  end: string;
  duration: number;
  priority: string;
}

interface TimeSlot {
  start: string;
  end: string;
  duration: number;
  confidence: number;
}

interface ConflictDetectionPanelProps {
  conflicts?: ConflictingTask[];
  suggestions?: TimeSlot[];
  onSelectSuggestion?: (slot: TimeSlot) => void;
}

export const ConflictDetectionPanel: React.FC<ConflictDetectionPanelProps> = ({
  conflicts = [],
  suggestions = [],
  onSelectSuggestion,
}) => {
  if (conflicts.length === 0 && suggestions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 animate-slide-down">
      {/* Conflicts */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                Time Conflict Detected
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300">
                This time overlaps with {conflicts.length} existing {conflicts.length === 1 ? 'task' : 'tasks'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {conflicts.map((conflict, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-800"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{conflict.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDateTime(conflict.start)} - {formatDateTime(conflict.end)}
                  </p>
                </div>
                <div className="px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-semibold">
                  {conflict.priority.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-2 border-primary-200 dark:border-primary-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg">
              <SparklesIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100">
                Smart Time Suggestions
              </h3>
              <p className="text-sm text-primary-700 dark:text-primary-300">
                Here are alternative time slots that work better
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            {suggestions.map((slot, index) => (
              <button
                key={index}
                onClick={() => onSelectSuggestion?.(slot)}
                className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-primary-500 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/40 rounded-lg group-hover:scale-110 transition-transform">
                    <ClockIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatDateTime(slot.start)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Duration: {slot.duration} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-lg bg-primary-100 dark:bg-primary-900/40">
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary-600 dark:bg-primary-400"></div>
                      <span className="text-xs font-semibold text-primary-700 dark:text-primary-300">
                        {Math.round(slot.confidence * 100)}% Match
                      </span>
                    </div>
                  </div>
                  <div className="p-1 rounded-lg bg-primary-600 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
