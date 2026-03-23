import { apiClient } from '../client';
import type { Table } from '@/types';

export interface CreateTableBody {
  number: number;
  capacity: number;
  locationId: number;
}

export interface UpdateTableBody {
  number?: number;
  capacity?: number;
  locationId?: number;
}

export const adminTablesApi = {
  getAll: (locationId?: number): Promise<Table[]> =>
    apiClient.get('/tables', { params: locationId ? { locationId } : {} }).then(r => r.data),

  create: (body: CreateTableBody): Promise<Table> =>
    apiClient.post('/tables', body).then(r => r.data),

  update: (id: number, body: UpdateTableBody): Promise<Table> =>
    apiClient.patch(`/tables/${id}`, body).then(r => r.data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/tables/${id}`).then(r => r.data),
};
