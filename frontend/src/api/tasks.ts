import apiClient from './client';
import type {
  ApiResponse,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  ParseNaturalLanguageInput,
  ParsedTask,
  CreateRecurringTaskInput,
  RecurringTaskResponse,
  UpdateRecurringTaskInput,
  DeleteRecurringTaskInput,
  ReminderStats,
  ScheduleReminderInput,
  DeadlineCheckResponse,
  SearchParams,
} from '@/types/api';

export const tasksApi = {
  // Get all tasks
  getTasks: async (params?: SearchParams): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks', { params });
    return response.data.data;
  },

  // Get task by ID
  getTaskById: async (taskId: string): Promise<Task> => {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${taskId}`);
    return response.data.data;
  },

  // Create task
  createTask: async (data: CreateTaskInput): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>('/tasks', data);
    return response.data.data;
  },

  // Update task
  updateTask: async (taskId: string, data: UpdateTaskInput): Promise<Task> => {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}`, data);
    return response.data.data;
  },

  // Delete task
  deleteTask: async (taskId: string): Promise<void> => {
    await apiClient.delete(`/tasks/${taskId}`);
  },

  // Archive task
  archiveTask: async (taskId: string): Promise<Task> => {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/archive`);
    return response.data.data;
  },

  // Unarchive task
  unarchiveTask: async (taskId: string): Promise<Task> => {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/unarchive`);
    return response.data.data;
  },

  // Mark task as completed
  markAsCompleted: async (taskId: string): Promise<Task> => {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/complete`);
    return response.data.data;
  },

  // Mark task as pending
  markAsPending: async (taskId: string): Promise<Task> => {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/pending`);
    return response.data.data;
  },

  // Search tasks
  searchTasks: async (query: string): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks/search', {
      params: { query },
    });
    return response.data.data;
  },

  // Filter by category
  filterByCategory: async (category: string): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>(`/tasks/category/${category}`);
    return response.data.data;
  },

  // Sort tasks
  sortTasksByDeadline: async (ascending = true): Promise<Task[]> => {
    const endpoint = ascending ? '/tasks/sort/deadline' : '/tasks/sort/priority';
    const response = await apiClient.get<ApiResponse<Task[]>>(endpoint);
    return response.data.data;
  },

  sortTasksByCreationDate: async (): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks/sort/created');
    return response.data.data;
  },

  sortTasksByTimeRequired: async (): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks/sort/time-required');
    return response.data.data;
  },

  // Parse natural language
  parseNaturalLanguage: async (data: ParseNaturalLanguageInput): Promise<ParsedTask> => {
    const response = await apiClient.post<ApiResponse<ParsedTask>>('/tasks/nlp/parse', data);
    return response.data.data;
  },

  // Recurring tasks
  createRecurringTask: async (data: CreateRecurringTaskInput): Promise<RecurringTaskResponse> => {
    const response = await apiClient.post<ApiResponse<RecurringTaskResponse>>(
      '/tasks/recurring',
      data
    );
    return response.data.data;
  },

  getRecurringTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>('/tasks/recurring');
    return response.data.data;
  },

  getRecurringTaskInstances: async (taskId: string): Promise<Task[]> => {
    const response = await apiClient.get<ApiResponse<Task[]>>(
      `/tasks/recurring/${taskId}/instances`
    );
    return response.data.data;
  },

  updateRecurringTask: async (
    taskId: string,
    data: UpdateRecurringTaskInput
  ): Promise<Task | Task[]> => {
    const response = await apiClient.put<ApiResponse<Task | Task[]>>(
      `/tasks/recurring/${taskId}`,
      data
    );
    return response.data.data;
  },

  deleteRecurringTask: async (taskId: string, data: DeleteRecurringTaskInput): Promise<void> => {
    await apiClient.delete(`/tasks/recurring/${taskId}`, { data });
  },

  // Comments
  addComment: async (taskId: string, comment: string): Promise<Task> => {
    const response = await apiClient.post<ApiResponse<Task>>(`/tasks/${taskId}/comments`, {
      comment,
    });
    return response.data.data;
  },

  getComments: async (taskId: string): Promise<string[]> => {
    const response = await apiClient.get<ApiResponse<string[]>>(`/tasks/${taskId}/comments`);
    return response.data.data;
  },

  // Reminders
  getReminderStats: async (): Promise<ReminderStats> => {
    const response = await apiClient.get<ApiResponse<ReminderStats>>('/tasks/reminders/stats');
    return response.data.data;
  },

  scheduleReminder: async (taskId: string, data: ScheduleReminderInput): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>(
      `/tasks/${taskId}/reminder`,
      data
    );
    return response.data.data;
  },

  checkDeadlines: async (): Promise<DeadlineCheckResponse> => {
    const response = await apiClient.get<ApiResponse<DeadlineCheckResponse>>(
      '/tasks/deadlines/check'
    );
    return response.data.data;
  },

  // Send welcome email (testing)
  sendWelcomeEmail: async (email: string, emailConfig?: any): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>('/tasks/send-welcome-email', {
      email,
      emailConfig,
    });
    return response.data.data;
  },
};
