import { z } from 'zod';

import type { User } from '@/shared/types';
import { POLISH_PHONE_REGEX, SPECIAL_CHAR_REGEX } from '@/features/auth/schemas/auth.schema';

export const editProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(1, 'Phone number is required').regex(POLISH_PHONE_REGEX, 'Enter a valid Polish phone number (e.g. +48 123 456 789)'),
});

export type EditProfileData = z.infer<typeof editProfileSchema>;

export interface EditNameFormProps {
  user: User;
}

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    password: z.string().min(6, 'At least 6 characters').regex(SPECIAL_CHAR_REGEX, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordFormData = z.infer<typeof passwordSchema>;
