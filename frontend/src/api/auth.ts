import apiClient from './client';
import type {
  ApiResponse,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RefreshTokenResponse,
  User,
  ChangePasswordInput,
  UpdateProfileInput,
  UpdateEmailConfigInput,
} from '@/types/api';

export const authApi = {
  // Register new user
  register: async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>('/auth/register', data);
    return response.data.data;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  // Get current user
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordInput): Promise<void> => {
    await apiClient.patch('/auth/change-password', data);
  },

  // Update profile
  updateProfile: async (data: UpdateProfileInput): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>('/auth/update', data);
    return response.data.data;
  },

  // Update email configuration
  updateEmailConfig: async (data: UpdateEmailConfigInput): Promise<{ emailConfig: any }> => {
    const response = await apiClient.patch<ApiResponse<{ emailConfig: any }>>(
      '/auth/email-config',
      data
    );
    return response.data.data;
  },

  // Delete account
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete('/auth/delete');
  },
};
