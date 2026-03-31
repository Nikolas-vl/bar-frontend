import { z } from 'zod';

export const POLISH_PHONE_REGEX = /^(\+48[\s-]?)?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;
export const SPECIAL_CHAR_REGEX = /[!@#$%^&*()\-_=+[\]{};:'",.<>?/\\|`~]/;

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required').regex(POLISH_PHONE_REGEX, 'Enter a valid Polish phone number (e.g. +48 123 456 789)'),
    password: z.string().min(6, 'Password must be at least 6 characters').regex(SPECIAL_CHAR_REGEX, 'Must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormInput = z.input<typeof loginSchema>;
export type LoginFormOutput = z.output<typeof loginSchema>;

export type RegisterFormInput = z.input<typeof registerSchema>;
export type RegisterFormOutput = z.output<typeof registerSchema>;
