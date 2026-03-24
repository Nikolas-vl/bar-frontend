import { apiClient } from '../client';
import type { Settings } from '@/shared/types';

export interface UpdateSettingsBody {
  restaurantName?: string;
  taxRate?: number;
  deliveryFee?: number;
  serviceFee?: number;
  freeDeliveryThreshold?: number;
}

export const adminSettingsApi = {
  update: (body: UpdateSettingsBody): Promise<Settings> =>
    apiClient.patch('/settings/admin', body).then(r => r.data),
};
