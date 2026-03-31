import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { getErrorMessage } from '@/shared/lib/api/client';
import { cn } from '@/shared/lib/utils/cn';
import { Spinner } from '@/shared/ui';
import { editProfileSchema, passwordSchema, type EditNameFormProps, type EditProfileData, type PasswordFormData } from '../schemas/profile.schema';

export function EditNameForm({ user }: EditNameFormProps) {
  const { mutateAsync, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onTouched',
    defaultValues: {
      name: user.name ?? '',
      phone: user.phone ?? '',
    },
  });

  const busy = isSubmitting || isPending;
  const submitDisabled = busy || !isDirty || !isValid;

  const onSubmit = async (data: EditProfileData) => {
    try {
      await mutateAsync({ name: data.name, phone: data.phone });
      toast.success('Profile updated');
      reset(data);
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
        {!errors.phone && <p className='mt-1 text-xs text-ob-muted'>Used for order and reservation contact. Format: +48 XXX XXX XXX</p>}
      </div>

      <div className='flex justify-end'>
        <button type='submit' disabled={submitDisabled} className='btn-primary disabled:opacity-50'>
          {busy ? (
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

export function ChangePasswordForm() {
  const { mutateAsync, isPending } = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onTouched',
  });

  const busy = isSubmitting || isPending;
  const submitDisabled = busy || !isValid;

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
          placeholder='At least 6 characters + one special char'
          className={cn('input', errors.password && 'input-error')}
          autoComplete='new-password'
        />
        {errors.password && <p className='field-error'>{errors.password.message}</p>}
        {!errors.password && <p className='mt-1 text-xs text-ob-muted'>Min 6 characters, must include a special character (e.g. !@#$)</p>}
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
        <button type='submit' disabled={submitDisabled} className='btn-primary disabled:opacity-50'>
          {busy ? (
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
