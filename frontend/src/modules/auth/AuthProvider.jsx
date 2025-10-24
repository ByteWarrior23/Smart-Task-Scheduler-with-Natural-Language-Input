import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthQueries } from '../../shared/hooks/useAuthQueries';
import { getAuthTokens, setAuthTokens, clearAuthTokens } from '../../shared/api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { useGetUser, useRefreshToken } = useAuthQueries();

  const { data: userData, isLoading: userLoading } = useGetUser();
  const refreshTokenMutation = useRefreshToken();

  useEffect(() => {
    const initAuth = async () => {
      const tokens = getAuthTokens();
      if (tokens?.accessToken) {
        try {
          if (userData) {
            setUser(userData);
          }
        } catch (error) {
          try {
            const res = await refreshTokenMutation.mutateAsync();
            const data = res?.data || res;
            if (data?.accessToken) {
              setAuthTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
            }
          } catch (refreshError) {
            clearAuthTokens();
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [userData]);

  const login = async (credentials) => {
    // This will be handled by the login mutation
    setLoading(false);
  };

  const logout = () => {
    clearAuthTokens();
    setUser(null);
  };

  const value = {
    user,
    loading: loading || userLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};