import axios from 'axios';

const ACCESS_TOKEN_KEY = 'tm_access_token';
const REFRESH_TOKEN_KEY = 'tm_refresh_token';

export function getAuthTokens() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  return accessToken ? { accessToken, refreshToken: refreshToken ?? undefined } : null;
}

export function setAuthTokens(tokens: { accessToken: string; refreshToken?: string }) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  if (tokens.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export const api = axios.create({ baseURL: '/' });

api.interceptors.request.use((config) => {
  const tokens = getAuthTokens();
  if (tokens?.accessToken) {
    config.headers = config.headers ?? {};
    (config.headers as any)['Authorization'] = `Bearer ${tokens.accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: Array<(token: string | null) => void> = [];

function subscribeTokenRefresh(cb: (token: string | null) => void) {
  pendingRequests.push(cb);
}

function onRefreshed(token: string | null) {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    const status: number = error?.response?.status;

    if (status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            if (token) {
              original.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(original));
            } else {
              reject(error);
            }
          });
        });
      }

      original._retry = true;
      isRefreshing = true;
      try {
        const res = await axios.post('/api/v1/auth/refresh', { refreshToken: getAuthTokens()?.refreshToken });
        const { accessToken, refreshToken } = res.data.data;
        setAuthTokens({ accessToken, refreshToken });
        onRefreshed(accessToken);
        original.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(original);
      } catch (e) {
        onRefreshed(null);
        clearAuthTokens();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
