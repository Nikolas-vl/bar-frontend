import { apiClient } from '../client';
import type { PaginatedUsers, AdminUserWithDate } from '@/shared/types';

export interface AdminUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export interface AdminUpdateUserBody {
  name?: string;
  phone?: string;
  password?: string;
  role?: string;
}

export const adminUsersApi = {
  getAll: (params?: AdminUsersParams): Promise<PaginatedUsers> => apiClient.get('/users/admin/all', { params }).then(r => r.data),

  getOne: (id: number): Promise<AdminUserWithDate> => apiClient.get(`/users/admin/${id}`).then(r => r.data),

  update: (id: number, body: AdminUpdateUserBody): Promise<AdminUserWithDate> => apiClient.patch(`/users/admin/${id}`, body).then(r => r.data),

  delete: (id: number): Promise<void> => apiClient.delete(`/users/admin/${id}`).then(r => r.data),
};
