import { format, formatDistanceToNow, isPast, isFuture, isToday, isTomorrow, parseISO } from 'date-fns';

export const formatDate = (date: string | Date | null): string => {
  if (!date) return 'No deadline';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date | null): string => {
  if (!date) return 'No deadline';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy hh:mm a');
};

export const formatRelativeTime = (date: string | Date | null): string => {
  if (!date) return 'No deadline';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const isOverdue = (date: string | Date | null): boolean => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isPast(dateObj);
};

export const isDueSoon = (date: string | Date | null, hoursThreshold = 24): boolean => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  const diff = dateObj.getTime() - now.getTime();
  const hours = diff / (1000 * 60 * 60);
  return hours > 0 && hours <= hoursThreshold;
};

export const getDeadlineStatus = (date: string | Date | null): {
  label: string;
  color: string;
  isOverdue: boolean;
  isDueSoon: boolean;
} => {
  if (!date) {
    return {
      label: 'No deadline',
      color: 'text-gray-500',
      isOverdue: false,
      isDueSoon: false,
    };
  }

  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return {
      label: 'Due today',
      color: 'text-warning-600 dark:text-warning-500',
      isOverdue: false,
      isDueSoon: true,
    };
  }

  if (isTomorrow(dateObj)) {
    return {
      label: 'Due tomorrow',
      color: 'text-warning-600 dark:text-warning-500',
      isOverdue: false,
      isDueSoon: true,
    };
  }

  if (isPast(dateObj)) {
    return {
      label: 'Overdue',
      color: 'text-danger-600 dark:text-danger-500',
      isOverdue: true,
      isDueSoon: false,
    };
  }

  if (isDueSoon(date, 48)) {
    return {
      label: formatRelativeTime(date),
      color: 'text-warning-600 dark:text-warning-500',
      isOverdue: false,
      isDueSoon: true,
    };
  }

  return {
    label: formatRelativeTime(date),
    color: 'text-gray-600 dark:text-gray-400',
    isOverdue: false,
    isDueSoon: false,
  };
};

export const formatDuration = (minutes: number | null): string => {
  if (!minutes) return 'Not specified';
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${mins}m`;
};
