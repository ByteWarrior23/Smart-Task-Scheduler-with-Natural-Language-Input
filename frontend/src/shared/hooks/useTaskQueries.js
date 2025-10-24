import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/api';

// Query keys
export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  list: (filters) => [...taskKeys.lists(), { filters }],
  details: () => [...taskKeys.all, 'detail'],
  detail: (id) => [...taskKeys.details(), id],
  recurring: () => [...taskKeys.all, 'recurring'],
  recurringInstances: (id) => [...taskKeys.recurring(), id, 'instances'],
  comments: (id) => [...taskKeys.all, 'comments', id],
  stats: () => [...taskKeys.all, 'stats'],
};

// ============================================================================
// QUERIES
// ============================================================================

export function useTasksQuery(options = {}) {
  return useQuery({
    queryKey: taskKeys.list(options.filters),
    queryFn: async () => {
      const response = await taskApi.getAll(options.filters);
      return response.data.data;
    },
    staleTime: 30000, // 30 seconds
    ...options,
  });
}

export function useTaskQuery(taskId, options = {}) {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: async () => {
      const response = await taskApi.getById(taskId);
      return response.data.data;
    },
    enabled: !!taskId,
    staleTime: 60000, // 1 minute
    ...options,
  });
}

export function useRecurringTasksQuery(options = {}) {
  return useQuery({
    queryKey: taskKeys.recurring(),
    queryFn: async () => {
      const response = await taskApi.getRecurring();
      return response.data.data;
    },
    staleTime: 60000,
    ...options,
  });
}

export function useRecurringInstancesQuery(taskId, options = {}) {
  return useQuery({
    queryKey: taskKeys.recurringInstances(taskId),
    queryFn: async () => {
      const response = await taskApi.getRecurringInstances(taskId);
      return response.data.data;
    },
    enabled: !!taskId,
    staleTime: 60000,
    ...options,
  });
}

export function useTaskCommentsQuery(taskId, options = {}) {
  return useQuery({
    queryKey: taskKeys.comments(taskId),
    queryFn: async () => {
      const response = await taskApi.getComments(taskId);
      return response.data.data;
    },
    enabled: !!taskId,
    staleTime: 30000,
    ...options,
  });
}

export function useReminderStatsQuery(options = {}) {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: async () => {
      const response = await taskApi.getReminderStats();
      return response.data.data;
    },
    staleTime: 60000,
    ...options,
  });
}

export function useSearchTasksQuery(query, options = {}) {
  return useQuery({
    queryKey: [...taskKeys.lists(), 'search', query],
    queryFn: async () => {
      const response = await taskApi.search(query);
      return response.data.data;
    },
    enabled: !!query && query.length > 0,
    staleTime: 30000,
    ...options,
  });
}

// ============================================================================
// MUTATIONS
// ============================================================================

export function useCreateTaskMutation(options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => taskApi.create(data),
    onSuccess: (response) => {
      // Invalidate tasks list to refetch
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      options.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
}

export function useUpdateTaskMutation(options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, data }) => taskApi.update(taskId, data),
    onMutate: async ({ taskId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(taskId) });
      
      // Snapshot previous value
      const previousTask = queryClient.getQueryData(taskKeys.detail(taskId));
      
      // Optimistically update
      if (previousTask) {
        queryClient.setQueryData(taskKeys.detail(taskId), {
          ...previousTask,
          ...data,
        });
      }
      
      return { previousTask };
    },
    onError: (err, { taskId }, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(taskKeys.detail(taskId), context.previousTask);
      }
      options.onError?.(err);
    },
    onSuccess: (response, { taskId }) => {
      queryClient.setQueryData(taskKeys.detail(taskId), response.data.data);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      options.onSuccess?.(response.data.data);
    },
  });
}

export function useDeleteTaskMutation(options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId) => taskApi.delete(taskId),
    onSuccess: (response, taskId) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      options.onSuccess?.(response.data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
}

export function useCompleteTaskMutation(options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId) => taskApi.complete(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(taskId) });
      const previousTask = queryClient.getQueryData(taskKeys.detail(taskId));
      
      if (previousTask) {
        queryClient.setQueryData(taskKeys.detail(taskId), {
          ...previousTask,
          status: 'completed',
        });
      }
      
      return { previousTask };
    },
    onError: (err, taskId, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(taskKeys.detail(taskId), context.previousTask);
      }
      options.onError?.(err);
    },
    onSuccess: (response, taskId) => {
      queryClient.setQueryData(taskKeys.detail(taskId), response.data.data);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      options.onSuccess?.(response.data.data);
    },
  });
}

export function usePendingTaskMutation(options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId) => taskApi.pending(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(taskId) });
      const previousTask = queryClient.getQueryData(taskKeys.detail(taskId));
      
      if (previousTask) {
        queryClient.setQueryData(taskKeys.detail(taskId), {
          ...previousTask,
          status: 'pending',
        });
      }
      
      return { previousTask };
    },
    onError: (err, taskId, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(taskKeys.detail(taskId), context.previousTask);
      }
      options.onError?.(err);
    },
    onSuccess: (response, taskId) => {
      queryClient.setQueryData(taskKeys.detail(taskId), response.data.data);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      options.onSuccess?.(response.data.data);
    },
  });
}

export function useArchiveTaskMutation(options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId) => taskApi.archive(taskId),
    onSuccess: (response, taskId) => {
      queryClient.setQueryData(taskKeys.detail(taskId), response.data.data);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      options.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
}

export function useUnarchiveTaskMutation(options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId) => taskApi.unarchive(taskId),
    onSuccess: (response, taskId) => {
      queryClient.setQueryData(taskKeys.detail(taskId), response.data.data);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      options.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
}

export function useAddCommentMutation(options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, comment }) => taskApi.addComment(taskId, comment),
    onSuccess: (response, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskId) });
      options.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
}

export function useCreateRecurringTaskMutation(options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => taskApi.createRecurring(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.recurring() });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      options.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
}

export function useUpdateRecurringTaskMutation(options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, data }) => taskApi.updateRecurring(taskId, data),
    onSuccess: (response, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.recurring() });
      queryClient.invalidateQueries({ queryKey: taskKeys.recurringInstances(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      options.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
}

export function useDeleteRecurringTaskMutation(options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, deleteType }) => taskApi.deleteRecurring(taskId, deleteType),
    onSuccess: (response, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.recurring() });
      queryClient.invalidateQueries({ queryKey: taskKeys.recurringInstances(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      options.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
}

export function useScheduleReminderMutation(options = {}) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, reminderTime }) => taskApi.scheduleReminder(taskId, reminderTime),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      options.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
}

export function useParseNLPMutation(options = {}) {
  return useMutation({
    mutationFn: (text) => taskApi.parseNaturalLanguage(text),
    onSuccess: (response) => {
      options.onSuccess?.(response.data.data);
    },
    onError: (error) => {
      options.onError?.(error);
    },
  });
}
