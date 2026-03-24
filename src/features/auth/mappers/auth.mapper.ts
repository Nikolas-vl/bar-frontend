import type { LoginFormOutput, RegisterFormOutput } from '../schemas/auth.schema';
import type { LoginDto, RegisterDto } from '../dto/auth.dto';

export const mapLoginFormToDto = (formData: LoginFormOutput): LoginDto => ({
  email: formData.email,
  password: formData.password,
});

export const mapRegisterFormToDto = (formData: RegisterFormOutput): RegisterDto => ({
  email: formData.email,
  password: formData.password,
  name: formData.name || undefined,
  phone: formData.phone,
});
