import { apiClient } from './client';
import type { Settings } from '@/types';

export const settingsApi = {
  getSettings: (): Promise<Settings> => apiClient.get('/settings').then(r => r.data),
};
