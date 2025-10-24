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
        // Store tokens
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        queryClient.setQueryData(['user'], data.safeUser);
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
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          await authApi.logout();
        }
      },
      onSuccess: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        queryClient.clear();
      },
    });
  };

  const useGetUser = () => {
    return useQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const response = await authApi.getMe();
        return response.data;
      },
      enabled: !!localStorage.getItem('accessToken'),
    });
  };

  const useRefreshToken = () => {
    return useMutation({
      mutationFn: async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await authApi.refresh(refreshToken);
        return response.data;
      },
      onSuccess: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      },
    });
  };

  return {
    useLogin,
    useRegister,
    useLogout,
    useGetUser,
    useRefreshToken,
  };
};


