export interface User {
  id: string;
  username: string;
  email: string;
  fullname: string;
  profile_picture?: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
  emailConfig?: {
    service: string;
    user: string | null;
    pass: string | null;
    host: string | null;
    port: number | null;
    secure: boolean;
  };
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline: string | null;
  owner: string; // User ID
  recurring: boolean;
  natural_language_input?: string;
  auto_categorized: boolean;
  smart_suggestions: string[];
  dependencies: string[]; // Array of Task IDs
  parent_task_id?: string; // Parent Task ID for recurring tasks
  occurrence_index?: number;
  rrule_string?: string;
  comments: string[];
  category: string;
  archived: boolean;
  time_required?: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  success: boolean;
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

export interface ParsedTask {
  title: string;
  description: string;
  deadline: string | null;
  time_required: number | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  recurrenceRule: string | null;
  natural_language_input: string;
  confidence: number;
  suggestions?: TimeSlotSuggestion[];
}

export interface TimeSlotSuggestion {
  start: string;
  end: string;
  duration: number;
  confidence: number;
}

export interface ReminderStats {
  upcoming: number;
  overdue: number;
  urgent: number;
  total: number;
}

export interface EmailConfig {
  service?: string;
  user?: string;
  pass?: string;
  host?: string;
  port?: number;
  secure?: boolean;
}
