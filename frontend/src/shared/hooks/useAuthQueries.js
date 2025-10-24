import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/api';

// Authentication Queries
export const useAuthQueries = () => {
  const queryClient = useQueryClient();

  const useLogin = () => {
    return useMutation({
      mutationFn: async (credentials) => {
        const response = await authApi.login(credentials);
        return response.data;
      },
      onSuccess: (data) => {
        // Store tokens using correct keys
        localStorage.setItem('tm_access_token', data.data.accessToken);
        localStorage.setItem('tm_refresh_token', data.data.refreshToken);
        queryClient.setQueryData(['user'], data.data.safeUser);
      },
    });
  };

  const useRegister = () => {
    return useMutation({
      mutationFn: async (userData) => {
        const response = await authApi.register(userData);
        return response.data;
      },
    });
  };

  const useLogout = () => {
    return useMutation({
      mutationFn: async () => {
        const refreshToken = localStorage.getItem('tm_refresh_token');
        if (refreshToken) {
          await authApi.logout();
        }
      },
      onSuccess: () => {
        localStorage.removeItem('tm_access_token');
        localStorage.removeItem('tm_refresh_token');
        queryClient.clear();
      },
    });
  };

  const useGetUser = () => {
    return useQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const response = await authApi.getMe();
        return response.data.data;
      },
      enabled: !!localStorage.getItem('tm_access_token'),
    });
  };

  const useRefreshToken = () => {
    return useMutation({
      mutationFn: async () => {
        const refreshToken = localStorage.getItem('tm_refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        const response = await authApi.refresh(refreshToken);
        return response.data;
      },
      onSuccess: (data) => {
        localStorage.setItem('tm_access_token', data.data.accessToken);
        localStorage.setItem('tm_refresh_token', data.data.refreshToken);
      },
    });
  };

  const useForgotPassword = () => {
    return useMutation({
      mutationFn: async (data) => {
        const response = await authApi.forgotPassword(data);
        return response.data;
      },
    });
  };

  const useResetPassword = () => {
    return useMutation({
      mutationFn: async (data) => {
        const response = await authApi.resetPassword(data);
        return response.data;
      },
    });
  };

  return {
    useLogin,
    useRegister,
    useLogout,
    useGetUser,
    useRefreshToken,
    useForgotPassword,
    useResetPassword,
  };
};


