import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/app/store/auth.store';
import { hasAuthSessionHint } from '@/shared/lib/auth/sessionHint';

const API_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  res => res,

  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };
    const requestUrl = originalRequest?.url ?? '';
    const isRefreshRequest = requestUrl.includes('/auth/refresh');
    const isAuthRequest = requestUrl.startsWith('/auth/');

    if (error.response?.status !== 401 || originalRequest._retry || isRefreshRequest) {
      return Promise.reject(error);
    }

    if (!hasAuthSessionHint() || isAuthRequest) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: token => {
            originalRequest.headers!['Authorization'] = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });

      const newToken: string = data.accessToken;
      useAuthStore.getState().setAccessToken(newToken);

      processQueue(null, newToken);
      originalRequest.headers!['Authorization'] = `Bearer ${newToken}`;

      return apiClient(originalRequest);
    } catch (err) {
      processQueue(err, null);
      useAuthStore.getState().clearAuth();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (Array.isArray(data?.issues) && data.issues.length > 0) {
      return data.issues.map((i: { message: string }) => i.message).join(', ');
    }
    return data?.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
};
