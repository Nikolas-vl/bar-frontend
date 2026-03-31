import type { AdminUserWithDate } from '@/shared/types/user.types';
import type { UpdateUserDto } from '../dto/user.dto';
import type { EditUserFormOutput } from '../schemas/user.schema';

export const mapUserToForm = (user: AdminUserWithDate): EditUserFormOutput => ({
  name: user.name ?? '',
  phone: user.phone ?? '',
  password: '',
  role: user.role,
});

export const mapUserFormToDto = (formData: EditUserFormOutput, originalUser: AdminUserWithDate | null): UpdateUserDto => {
  const cleaned: UpdateUserDto = {};
  if (formData.name && formData.name !== originalUser?.name) cleaned.name = formData.name;
  if (formData.phone && formData.phone !== originalUser?.phone) cleaned.phone = formData.phone;
  if (formData.password) cleaned.password = formData.password;
  if (formData.role !== originalUser?.role) cleaned.role = formData.role;
  return cleaned;
};
