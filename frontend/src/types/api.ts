// API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

// User types
export interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
  fullname: string;
  profile_picture?: string | null;
  role: 'user' | 'admin';
  emailConfig?: EmailConfig;
  createdAt: string;
  updatedAt: string;
}

export interface EmailConfig {
  service: string;
  user: string | null;
  pass: string | null;
  host: string | null;
  port: number | null;
  secure: boolean;
}

// Auth types
export interface LoginCredentials {
  username?: string;
  email?: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  fullname: string;
  password: string;
}

export interface AuthResponse {
  safeUser: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Task types
export type TaskStatus = 'pending' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline: string | null;
  owner: string;
  recurring: boolean;
  natural_language_input: string | null;
  auto_categorized: boolean;
  smart_suggestions: string[];
  dependencies: string[];
  parent_task_id: string | null;
  occurrence_index: number | null;
  rrule_string: string | null;
  comments: string[];
  category: string;
  archived: boolean;
  time_required: number | null; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  deadline?: string | null;
  priority?: TaskPriority;
  category?: string;
  time_required?: number | null;
  natural_language_input?: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  deadline?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  category?: string;
  time_required?: number | null;
}

export interface ParseNaturalLanguageInput {
  text: string;
}

export interface ParsedTask {
  title: string;
  description: string;
  deadline: string | null;
  time_required: number | null;
  priority: TaskPriority;
  category: string;
  recurrenceRule: string | null;
  natural_language_input: string;
  confidence: number;
  suggestions?: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
  duration: number;
  confidence: number;
}

export interface ConflictingTask {
  taskId: string;
  title: string;
  start: string;
  end: string;
  duration: number;
  priority: TaskPriority;
}

export interface ConflictResponse {
  conflicts: ConflictingTask[];
  suggestions: TimeSlot[];
}

// Recurring task types
export interface CreateRecurringTaskInput {
  title: string;
  description: string;
  deadline: string;
  priority?: TaskPriority;
  category?: string;
  time_required?: number;
  rrule_string: string;
  end_date?: string;
}

export interface RecurringTaskResponse {
  parent_task: Task;
  instances: Task[];
  note?: string;
}

export interface UpdateRecurringTaskInput extends UpdateTaskInput {
  update_type: 'this' | 'following' | 'all';
}

export interface DeleteRecurringTaskInput {
  delete_type: 'this' | 'following' | 'all';
}

// Reminder types
export interface ReminderStats {
  upcoming: number;
  overdue: number;
  urgent: number;
  total: number;
}

export interface ScheduleReminderInput {
  reminderTime: string;
}

export interface DeadlineCheckResponse {
  upcoming: any[];
  overdue: any[];
  total: number;
}

// Voice types
export interface TranscriptionResponse {
  text: string;
  originalFilename: string;
  fileSize: number;
}

export interface VoiceTaskResponse {
  transcribedText: string;
  parsedTask: ParsedTask;
  originalFilename: string;
  fileSize: number;
}

export interface VoiceTaskCreatedResponse extends VoiceTaskResponse {
  task: Task;
}

// Profile update types
export interface UpdateProfileInput {
  username?: string;
  email?: string;
  fullname?: string;
  profile_picture?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailConfigInput {
  emailConfig: EmailConfig;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Search and filter types
export interface SearchParams {
  query?: string;
  category?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  archived?: boolean;
}
