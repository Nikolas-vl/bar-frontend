import { apiClient } from './client';
import type { User } from '@/types';

export interface UpdateProfilePayload {
  name?: string;
  password?: string;
  currentPassword?: string;
}

export const userApi = {
  getMe: async (): Promise<User> => {
    const res = await apiClient.get('/users/me');
    return res.data;
  },

  updateMe: async (payload: UpdateProfilePayload): Promise<User> => {
    const res = await apiClient.patch('/users/me', payload);
    return res.data;
  },
};
