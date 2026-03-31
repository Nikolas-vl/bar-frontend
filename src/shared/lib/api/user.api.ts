import { apiClient } from './client';
import type { User } from '@/shared/types';

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  password?: string;
  currentPassword?: string;
}

export const userApi = {
  getMe: async (): Promise<User> => {
    const res = await apiClient.get('/users/profile');
    return res.data;
  },

  updateMe: async (payload: UpdateProfilePayload): Promise<User> => {
    const res = await apiClient.patch('/users/profile', payload);
    return res.data;
  },
};
