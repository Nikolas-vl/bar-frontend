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
}

export interface AuthTokens {
  accessToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  phone: string;
  name?: string;
}

export interface PaginatedUsers {
  users: AdminUserWithDate[];
  total: number;
  page: number;
  limit: number;
}
