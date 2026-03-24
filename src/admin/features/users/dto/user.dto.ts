export interface UpdateUserDto {
  name?: string;
  phone?: string;
  password?: string;
  role?: 'USER' | 'ADMIN';
}
