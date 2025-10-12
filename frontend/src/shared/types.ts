export type ApiResponse<T> = {
  statusCode?: number;
  message: string;
  data: T;
};

export type User = {
  id: string;
  username: string;
  email: string;
  fullname: string;
  role?: 'user' | 'admin';
  profile_picture?: string | null;
};

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline: string | null;
  category: string;
  archived: boolean;
  time_required: number | null;
  comments: string[];
  createdAt: string;
};
