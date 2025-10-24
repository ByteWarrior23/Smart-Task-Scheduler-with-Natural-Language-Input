import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/api';
import { setAuthTokens, clearAuthTokens } from '../api/client';

// Authentication Queries
export const useAuthQueries = () => {
  const queryClient = useQueryClient();

  const useLogin = () => {
    return useMutation({
      mutationFn: async (credentials) => {
        const response = await authApi.login(credentials);
        return response.data;
      },
      onSuccess: (wrapped) => {
        // Backend wraps response in ApiResponse
        const data = wrapped?.data || wrapped;
        if (data?.accessToken) {
          setAuthTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        }
        if (data?.safeUser) {
          queryClient.setQueryData(['user'], data.safeUser);
        } else if (wrapped?.data?.safeUser) {
          queryClient.setQueryData(['user'], wrapped.data.safeUser);
        }
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
        await authApi.logout();
      },
      onSuccess: () => {
        clearAuthTokens();
        queryClient.clear();
      },
    });
  };

  const useGetUser = () => {
    return useQuery({
      queryKey: ['user'],
      queryFn: async () => {
        const response = await authApi.getMe();
        return response.data?.data ?? response.data;
      },
      enabled: !!(typeof window !== 'undefined' && localStorage.getItem('tm_access_token')),
    });
  };

  const useRefreshToken = () => {
    return useMutation({
      mutationFn: async () => {
        const response = await authApi.refresh(undefined);
        return response.data;
      },
      onSuccess: (wrapped) => {
        const data = wrapped?.data || wrapped;
        if (data?.accessToken) {
          setAuthTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        }
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


