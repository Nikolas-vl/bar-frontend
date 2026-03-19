import { apiClient } from './client';
import type { Location } from '@/types';

export const locationsApi = {
  getAll: async (): Promise<Location[]> => {
    const res = await apiClient.get('/locations');
    return res.data;
  },
};
