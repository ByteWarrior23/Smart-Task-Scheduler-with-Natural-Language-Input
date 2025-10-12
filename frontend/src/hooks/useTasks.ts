import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/api/tasks';
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  ParseNaturalLanguageInput,
  CreateRecurringTaskInput,
  UpdateRecurringTaskInput,
  DeleteRecurringTaskInput,
  SearchParams,
} from '@/types/api';
import toast from 'react-hot-toast';

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: SearchParams) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  recurring: () => [...taskKeys.all, 'recurring'] as const,
  recurringInstances: (id: string) => [...taskKeys.all, 'recurring-instances', id] as const,
  reminders: () => [...taskKeys.all, 'reminders'] as const,
  search: (query: string) => [...taskKeys.all, 'search', query] as const,
  category: (category: string) => [...taskKeys.all, 'category', category] as const,
};

// Get all tasks
export const useTasks = (params?: SearchParams) => {
  return useQuery({
    queryKey: taskKeys.list(params || {}),
    queryFn: () => tasksApi.getTasks(params),
    staleTime: 30000, // 30 seconds
  });
};

// Get task by ID
export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => tasksApi.getTaskById(taskId),
    enabled: !!taskId,
  });
};

// Create task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateTaskInput) => tasksApi.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      toast.success('Task created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    },
  });
};

// Update task
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: UpdateTaskInput }) =>
      tasksApi.updateTask(taskId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      toast.success('Task updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update task');
    },
  });
};

// Delete task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId: string) => tasksApi.deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      toast.success('Task deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    },
  });
};

// Archive/Unarchive task
export const useArchiveTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, archive }: { taskId: string; archive: boolean }) =>
      archive ? tasksApi.archiveTask(taskId) : tasksApi.unarchiveTask(taskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      toast.success(variables.archive ? 'Task archived' : 'Task unarchived');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Operation failed');
    },
  });
};

// Toggle task status
export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, completed }: { taskId: string; completed: boolean }) =>
      completed ? tasksApi.markAsCompleted(taskId) : tasksApi.markAsPending(taskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      toast.success(variables.completed ? 'Task completed!' : 'Task reopened');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Operation failed');
    },
  });
};

// Parse natural language
export const useParseNaturalLanguage = () => {
  return useMutation({
    mutationFn: (data: ParseNaturalLanguageInput) => tasksApi.parseNaturalLanguage(data),
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to parse input');
    },
  });
};

// Search tasks
export const useSearchTasks = (query: string) => {
  return useQuery({
    queryKey: taskKeys.search(query),
    queryFn: () => tasksApi.searchTasks(query),
    enabled: query.length > 0,
  });
};

// Filter by category
export const useTasksByCategory = (category: string) => {
  return useQuery({
    queryKey: taskKeys.category(category),
    queryFn: () => tasksApi.filterByCategory(category),
    enabled: !!category,
  });
};

// Recurring tasks
export const useCreateRecurringTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateRecurringTaskInput) => tasksApi.createRecurringTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.recurring() });
      toast.success('Recurring task created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create recurring task');
    },
  });
};

export const useRecurringTasks = () => {
  return useQuery({
    queryKey: taskKeys.recurring(),
    queryFn: () => tasksApi.getRecurringTasks(),
  });
};

export const useRecurringTaskInstances = (taskId: string) => {
  return useQuery({
    queryKey: taskKeys.recurringInstances(taskId),
    queryFn: () => tasksApi.getRecurringTaskInstances(taskId),
    enabled: !!taskId,
  });
};

// Comments
export const useAddComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, comment }: { taskId: string; comment: string }) =>
      tasksApi.addComment(taskId, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      toast.success('Comment added!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    },
  });
};

// Reminders
export const useReminderStats = () => {
  return useQuery({
    queryKey: taskKeys.reminders(),
    queryFn: () => tasksApi.getReminderStats(),
    refetchInterval: 60000, // Refetch every minute
  });
};
