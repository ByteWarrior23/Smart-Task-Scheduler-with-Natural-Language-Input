import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/api';
import { useAuth } from '../../modules/auth/AuthProvider';

// Auth Queries
export const useAuthQueries = () => {
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  // Get current user
  const useGetMe = () => {
    return useQuery({
      queryKey: ['auth', 'me'],
      queryFn: authApi.getMe,
      enabled: !!user,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Login mutation
  const useLogin = () => {
    return useMutation({
      mutationFn: authApi.login,
      onSuccess: () => {
        queryClient.invalidateQueries(['auth']);
      },
    });
  };

  // Register mutation
  const useRegister = () => {
    return useMutation({
      mutationFn: authApi.register,
    });
  };

  // Logout mutation
  const useLogout = () => {
    return useMutation({
      mutationFn: authApi.logout,
      onSuccess: () => {
        queryClient.clear();
        logout();
      },
    });
  };

  // Refresh token mutation
  const useRefreshToken = () => {
    return useMutation({
      mutationFn: authApi.refresh,
      onSuccess: (data) => {
        queryClient.invalidateQueries(['auth']);
      },
    });
  };

  // Change password mutation
  const useChangePassword = () => {
    return useMutation({
      mutationFn: authApi.changePassword,
      onSuccess: () => {
        queryClient.invalidateQueries(['auth', 'me']);
      },
    });
  };

  // Update user details mutation
  const useUpdateDetails = () => {
    return useMutation({
      mutationFn: authApi.updateDetails,
      onSuccess: () => {
        queryClient.invalidateQueries(['auth', 'me']);
      },
    });
  };

  // Update email config mutation
  const useUpdateEmailConfig = () => {
    return useMutation({
      mutationFn: authApi.updateEmailConfig,
      onSuccess: () => {
        queryClient.invalidateQueries(['auth', 'me']);
      },
    });
  };

  // Delete account mutation
  const useDeleteAccount = () => {
    return useMutation({
      mutationFn: authApi.deleteAccount,
      onSuccess: () => {
        queryClient.clear();
        logout();
      },
    });
  };

  return {
    useGetMe,
    useLogin,
    useRegister,
    useLogout,
    useRefreshToken,
    useChangePassword,
    useUpdateDetails,
    useUpdateEmailConfig,
    useDeleteAccount,
  };
};
