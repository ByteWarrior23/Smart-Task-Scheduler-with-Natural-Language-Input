import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthTokens, clearAuthTokens, getAuthTokens } from '../../shared/api/client';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
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

  const login = useCallback(async (payload) => {
    const res = await api.post('/api/v1/auth/login', payload);
    const { accessToken, refreshToken } = res.data.data;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setAuthTokens({ accessToken, refreshToken });
    try {
      const me = await api.get('/api/v1/auth/me');
      setUser(me.data.data);
    } catch {
      // ignore
    }
    navigate('/tasks');
  }, [navigate]);

  const register = useCallback(async (payload) => {
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
    try { await api.post('/api/v1/auth/logout'); } catch {}
    clearAuthTokens();
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  const value = useMemo(() => ({ user, accessToken, refreshToken, loading, login, register, refresh, logout }), [user, accessToken, refreshToken, loading, login, register, refresh, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
