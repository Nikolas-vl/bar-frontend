import { apiClient } from './client';
import type { Address } from '@/types';

export interface CreateAddressPayload {
  city: string;
  street: string;
  zip: string;
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>;

export const addressApi = {
  getAll: async (): Promise<Address[]> => {
    const res = await apiClient.get('/addresses');
    return res.data;
  },

  create: async (payload: CreateAddressPayload): Promise<Address> => {
    const res = await apiClient.post('/addresses', payload);
    return res.data;
  },

  update: async (id: number, payload: UpdateAddressPayload): Promise<Address> => {
    const res = await apiClient.patch(`/addresses/${id}`, payload);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/addresses/${id}`);
  },
};
