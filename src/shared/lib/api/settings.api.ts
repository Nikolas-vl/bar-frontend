import { apiClient } from './client';
import type { Settings } from '@/shared/types';

export const settingsApi = {
  getSettings: (): Promise<Settings> => apiClient.get('/settings').then(r => r.data),
};
