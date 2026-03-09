import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/auth.store';

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true, // for refresh token cookie
});

// Attach access token to every request
apiClient.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
};

// Auto refresh on 401
apiClient.interceptors.response.use(
  res => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status !== 401 || originalRequest._retry) {
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
      const { data } = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
      const newToken = data.accessToken;

      // useAuthStore.getState().setAccessToken(newToken);
      processQueue(null, newToken);
      originalRequest.headers!['Authorization'] = `Bearer ${newToken}`;

      return apiClient(originalRequest);
    } catch (err) {
      processQueue(err, null);
      useAuthStore.getState().logout();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);

// Helper to extract error message
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
};
