import { ROLE_CONFIG } from '@/shared/constants/user';

export type UserRole = keyof typeof ROLE_CONFIG;

export interface User {
  id: number;
  email: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
}

export interface AdminUserWithDate extends User {
  createdAt: string;
  activeOrdersCount: number;
}

export interface PaginatedUsers {
  users: AdminUserWithDate[];
  total: number;
  page: number;
  limit: number;
}
