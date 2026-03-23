import { apiClient } from '../client';
import type { Location } from '@/types';

export interface CreateLocationBody {
  name: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
}

export interface UpdateLocationBody extends Partial<CreateLocationBody> {
  isActive?: boolean;
}

export const adminLocationsApi = {
  getAll: (): Promise<Location[]> =>
    apiClient.get('/locations').then(r => r.data),

  getOne: (id: number): Promise<Location> =>
    apiClient.get(`/locations/${id}`).then(r => r.data),

  create: (body: CreateLocationBody): Promise<Location> =>
    apiClient.post('/locations/admin', body).then(r => r.data),

  update: (id: number, body: UpdateLocationBody): Promise<Location> =>
    apiClient.patch(`/locations/admin/${id}`, body).then(r => r.data),

  delete: (id: number): Promise<Location> =>
    apiClient.delete(`/locations/admin/${id}`).then(r => r.data),
};
