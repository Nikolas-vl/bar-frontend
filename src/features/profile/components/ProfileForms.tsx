import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { getErrorMessage } from '@/shared/lib/api/client';
import { cn } from '@/shared/lib/utils/cn';
import { Spinner } from '@/shared/ui';
import type { User } from '@/shared/types';

const editProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[0-9\s\-().]{7,20}$/, 'Invalid phone number'),
});

type EditProfileData = z.infer<typeof editProfileSchema>;

interface EditNameFormProps {
  user: User;
}

export function EditNameForm({ user }: EditNameFormProps) {
  const { mutateAsync, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user.name ?? '',
      phone: user.phone ?? '',
    },
  });

  const onSubmit = async (data: EditProfileData) => {
    try {
      await mutateAsync({ name: data.name, phone: data.phone });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <div>
        <label className='label'>Full name</label>
        <input {...register('name')} placeholder='Your name' className={cn('input', errors.name && 'input-error')} autoComplete='name' />
        {errors.name && <p className='field-error'>{errors.name.message}</p>}
      </div>

      <div>
        <label className='label'>Email address</label>
        <input value={user.email} disabled className='input opacity-60 cursor-not-allowed' />
        <p className='mt-1 text-xs text-ob-muted'>Email cannot be changed.</p>
      </div>

      <div>
        <label className='label'>Phone number</label>
        <input
          {...register('phone')}
          type='tel'
          placeholder='+48 123 456 789'
          className={cn('input', errors.phone && 'input-error')}
          autoComplete='tel'
        />
        {errors.phone && <p className='field-error'>{errors.phone.message}</p>}
        <p className='mt-1 text-xs text-ob-muted'>Used for order and reservation contact.</p>
      </div>

      <div className='flex justify-end'>
        <button type='submit' disabled={isPending || !isDirty} className='btn-primary disabled:opacity-50'>
          {isPending ? (
            <span className='flex items-center gap-2'>
              <Spinner variant='white' />
              Saving…
            </span>
          ) : (
            'Save changes'
          )}
        </button>
      </div>
    </form>
  );
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Required'),
    password: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine(d => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function ChangePasswordForm() {
  const { mutateAsync, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await mutateAsync({ currentPassword: data.currentPassword, password: data.password });
      toast.success('Password changed');
      reset();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <div>
        <label className='label'>Current password</label>
        <input
          {...register('currentPassword')}
          type='password'
          placeholder='••••••••'
          className={cn('input', errors.currentPassword && 'input-error')}
          autoComplete='current-password'
        />
        {errors.currentPassword && <p className='field-error'>{errors.currentPassword.message}</p>}
      </div>

      <div>
        <label className='label'>New password</label>
        <input
          {...register('password')}
          type='password'
          placeholder='At least 6 characters'
          className={cn('input', errors.password && 'input-error')}
          autoComplete='new-password'
        />
        {errors.password && <p className='field-error'>{errors.password.message}</p>}
      </div>

      <div>
        <label className='label'>Confirm new password</label>
        <input
          {...register('confirmPassword')}
          type='password'
          placeholder='Repeat new password'
          className={cn('input', errors.confirmPassword && 'input-error')}
          autoComplete='new-password'
        />
        {errors.confirmPassword && <p className='field-error'>{errors.confirmPassword.message}</p>}
      </div>

      <div className='flex justify-end'>
        <button type='submit' disabled={isPending} className='btn-primary'>
          {isPending ? (
            <span className='flex items-center gap-2'>
              <Spinner variant='white' />
              Updating…
            </span>
          ) : (
            'Change password'
          )}
        </button>
      </div>
    </form>
  );
}
