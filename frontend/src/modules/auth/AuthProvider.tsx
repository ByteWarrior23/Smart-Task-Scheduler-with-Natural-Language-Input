import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthTokens, clearAuthTokens, getAuthTokens } from '../../shared/api/client';
import { useNavigate } from 'react-router-dom';

export type User = {
  id: string;
  username: string;
  email: string;
  fullname: string;
  role?: 'user' | 'admin';
  profile_picture?: string | null;
};

export type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (payload: { username?: string; email?: string; password: string }) => Promise<void>;
  register: (payload: { username: string; email: string; fullname: string; password: string }) => Promise<void>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const bootstrap = useCallback(async () => {
    const tokens = getAuthTokens();
    if (!tokens?.accessToken) {
      setLoading(false);
      return;
    }
    setAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken ?? null);
    try {
      const res = await api.get('/api/v1/auth/me');
      setUser(res.data.data);
    } catch (e) {
      clearAuthTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { bootstrap(); }, [bootstrap]);

  const login = useCallback(async (payload: { username?: string; email?: string; password: string }) => {
    const res = await api.post('/api/v1/auth/login', payload);
    const { accessToken, refreshToken } = res.data.data;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setAuthTokens({ accessToken, refreshToken });
    try {
      const me = await api.get('/api/v1/auth/me');
      setUser(me.data.data);
    } catch {
      // ignore, user stays null if fetch fails
    }
    navigate('/tasks');
  }, [navigate]);

  const register = useCallback(async (payload: { username: string; email: string; fullname: string; password: string }) => {
    await api.post('/api/v1/auth/register', payload);
    await login({ username: payload.username, password: payload.password });
  }, [login]);

  const refresh = useCallback(async () => {
    const res = await api.post('/api/v1/auth/refresh', { refreshToken: getAuthTokens()?.refreshToken });
    const { accessToken: nextAccess, refreshToken: nextRefresh } = res.data.data;
    setAccessToken(nextAccess);
    setRefreshToken(nextRefresh);
    setAuthTokens({ accessToken: nextAccess, refreshToken: nextRefresh });
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch {}
    clearAuthTokens();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  const value: AuthContextType = useMemo(() => ({ user, accessToken, refreshToken, loading, login, register, refresh, logout }), [user, accessToken, refreshToken, loading, login, register, refresh, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
