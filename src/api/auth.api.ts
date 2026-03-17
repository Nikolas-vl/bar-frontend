import { apiClient } from './client';
import type { User, LoginInput, RegisterInput, AuthTokens } from '@/types';

export const authApi = {
  login: async (data: LoginInput): Promise<AuthTokens & { user: User }> => {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterInput): Promise<AuthTokens & { user: User }> => {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  refresh: async (): Promise<AuthTokens> => {
    const res = await apiClient.post('/auth/refresh');
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  me: async (): Promise<User> => {
    const res = await apiClient.get('/user/me');
    return res.data;
  },
};
