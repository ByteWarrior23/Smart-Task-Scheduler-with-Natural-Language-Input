import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/api';

// Task Queries
export const useTaskQueries = () => {
  const queryClient = useQueryClient();

  // Get all tasks
  const useGetTasks = (params = {}) => {
    return useQuery({
      queryKey: ['tasks', 'list', params],
      queryFn: () => taskApi.getAll(params),
      staleTime: 30 * 1000, // 30 seconds
    });
  };

  // Get task by ID
  const useGetTask = (taskId) => {
    return useQuery({
      queryKey: ['tasks', 'detail', taskId],
      queryFn: () => taskApi.getById(taskId),
      enabled: !!taskId,
    });
  };

  // Search tasks
  const useSearchTasks = (query) => {
    return useQuery({
      queryKey: ['tasks', 'search', query],
      queryFn: () => taskApi.search(query),
      enabled: !!query && query.length > 2,
    });
  };

  // Filter tasks by category
  const useFilterByCategory = (category) => {
    return useQuery({
      queryKey: ['tasks', 'category', category],
      queryFn: () => taskApi.filterByCategory(category),
      enabled: !!category,
    });
  };

  // Get recurring tasks
  const useGetRecurringTasks = () => {
    return useQuery({
      queryKey: ['tasks', 'recurring'],
      queryFn: taskApi.getRecurring,
    });
  };

  // Get recurring task instances
  const useGetRecurringInstances = (taskId) => {
    return useQuery({
      queryKey: ['tasks', 'recurring', 'instances', taskId],
      queryFn: () => taskApi.getRecurringInstances(taskId),
      enabled: !!taskId,
    });
  };

  // Get reminder stats
  const useGetReminderStats = () => {
    return useQuery({
      queryKey: ['tasks', 'reminder-stats'],
      queryFn: taskApi.getReminderStats,
      refetchInterval: 60 * 1000, // Refetch every minute
    });
  };

  // Get analytics
  const useGetAnalytics = () => {
    return useQuery({
      queryKey: ['tasks', 'analytics'],
      queryFn: taskApi.getAnalytics,
    });
  };

  // Get time slots
  const useGetTimeSlots = (duration, window = 7) => {
    return useQuery({
      queryKey: ['tasks', 'time-slots', duration, window],
      queryFn: () => taskApi.getTimeSlots(duration, window),
      enabled: !!duration,
    });
  };

  // Create task mutation
  const useCreateTask = () => {
    return useMutation({
      mutationFn: taskApi.create,
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  // Update task mutation
  const useUpdateTask = () => {
    return useMutation({
      mutationFn: ({ taskId, data }) => taskApi.update(taskId, data),
      onSuccess: (_, { taskId }) => {
        queryClient.invalidateQueries(['tasks']);
        queryClient.invalidateQueries(['tasks', 'detail', taskId]);
      },
    });
  };

  // Delete task mutation
  const useDeleteTask = () => {
    return useMutation({
      mutationFn: taskApi.delete,
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  // Complete task mutation
  const useCompleteTask = () => {
    return useMutation({
      mutationFn: taskApi.complete,
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  // Mark task as pending mutation
  const usePendingTask = () => {
    return useMutation({
      mutationFn: taskApi.pending,
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  // Archive task mutation
  const useArchiveTask = () => {
    return useMutation({
      mutationFn: taskApi.archive,
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  // Unarchive task mutation
  const useUnarchiveTask = () => {
    return useMutation({
      mutationFn: taskApi.unarchive,
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  // Add comment mutation
  const useAddComment = () => {
    return useMutation({
      mutationFn: ({ taskId, comment }) => taskApi.addComment(taskId, comment),
      onSuccess: (_, { taskId }) => {
        queryClient.invalidateQueries(['tasks', 'detail', taskId]);
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  // Get comments
  const useGetComments = (taskId) => {
    return useQuery({
      queryKey: ['tasks', 'comments', taskId],
      queryFn: () => taskApi.getComments(taskId),
      enabled: !!taskId,
    });
  };

  // Parse natural language mutation
  const useParseNaturalLanguage = () => {
    return useMutation({
      mutationFn: taskApi.parseNaturalLanguage,
    });
  };

  // Create recurring task mutation
  const useCreateRecurringTask = () => {
    return useMutation({
      mutationFn: taskApi.createRecurring,
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', 'recurring']);
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  // Update recurring task mutation
  const useUpdateRecurringTask = () => {
    return useMutation({
      mutationFn: ({ taskId, data }) => taskApi.updateRecurring(taskId, data),
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', 'recurring']);
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  // Delete recurring task mutation
  const useDeleteRecurringTask = () => {
    return useMutation({
      mutationFn: ({ taskId, deleteType }) => taskApi.deleteRecurring(taskId, deleteType),
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', 'recurring']);
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  // Schedule reminder mutation
  const useScheduleReminder = () => {
    return useMutation({
      mutationFn: ({ taskId, reminderTime }) => taskApi.scheduleReminder(taskId, reminderTime),
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', 'reminder-stats']);
      },
    });
  };

  // Check deadlines mutation
  const useCheckDeadlines = () => {
    return useMutation({
      mutationFn: taskApi.checkDeadlines,
    });
  };

  // Send welcome email mutation
  const useSendWelcomeEmail = () => {
    return useMutation({
      mutationFn: ({ email, emailConfig }) => taskApi.sendWelcomeEmail(email, emailConfig),
    });
  };

  // Bulk operations
  const useBulkUpdate = () => {
    return useMutation({
      mutationFn: ({ taskIds, updates }) => taskApi.bulkUpdate(taskIds, updates),
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  const useBulkDelete = () => {
    return useMutation({
      mutationFn: taskApi.bulkDelete,
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  const useBulkArchive = () => {
    return useMutation({
      mutationFn: taskApi.bulkArchive,
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  // Detect conflicts mutation
  const useDetectConflicts = () => {
    return useMutation({
      mutationFn: ({ deadline, duration }) => taskApi.detectConflicts(deadline, duration),
    });
  };

  // Export tasks mutation
  const useExportTasks = () => {
    return useMutation({
      mutationFn: (format) => taskApi.exportTasks(format),
    });
  };

  // Import tasks mutation
  const useImportTasks = () => {
    return useMutation({
      mutationFn: ({ file, format }) => taskApi.importTasks(file, format),
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
      },
    });
  };

  return {
    // Queries
    useGetTasks,
    useGetTask,
    useSearchTasks,
    useFilterByCategory,
    useGetRecurringTasks,
    useGetRecurringInstances,
    useGetReminderStats,
    useGetAnalytics,
    useGetTimeSlots,
    useGetComments,
    
    // Mutations
    useCreateTask,
    useUpdateTask,
    useDeleteTask,
    useCompleteTask,
    usePendingTask,
    useArchiveTask,
    useUnarchiveTask,
    useAddComment,
    useParseNaturalLanguage,
    useCreateRecurringTask,
    useUpdateRecurringTask,
    useDeleteRecurringTask,
    useScheduleReminder,
    useCheckDeadlines,
    useSendWelcomeEmail,
    useBulkUpdate,
    useBulkDelete,
    useBulkArchive,
    useDetectConflicts,
    useExportTasks,
    useImportTasks,
  };
};