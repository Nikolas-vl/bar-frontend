import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { authApi } from '@/shared/lib/api/auth.api';
import { useAuthStore } from '@/app/store/auth.store';
import { getErrorMessage } from '@/shared/lib/api/client';
import { cn } from '@/shared/lib/utils/cn';
import { Spinner } from '@/shared/ui';
import { registerSchema, type RegisterFormOutput } from '../schemas/auth.schema';
import { mapRegisterFormToDto } from '../mappers/auth.mapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleAuthButton } from '../components/GoogleAuthButton';

export default function RegisterPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormOutput>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormOutput) => {
    try {
      const { accessToken, user } = await authApi.register(mapRegisterFormToDto(data));
      setAuth(user, accessToken);
      toast.success(`Welcome to Jolie, ${user.name}! ☕`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-ob-bg'>
      <div className='w-full max-w-sm animate-slide-up'>
        <div className='text-center mb-8'>
          <div className='w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-ob-blue'>
            <span className='text-2xl'>🍽️</span>
          </div>
          <h1 className='font-display text-3xl font-semibold mb-2 text-ob-text'>Create account</h1>
          <p className='text-sm text-ob-muted'>Join Jolie and start ordering</p>
        </div>

        <div className='card p-7'>
          <GoogleAuthButton label='Sign up with Google' />

          <div className='auth-divider'>
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <div>
              <label className='label'>Full name</label>
              <input {...register('name')} placeholder='Your name' className={cn('input', errors.name && 'input-error')} autoComplete='name' />
              {errors.name && <p className='field-error'>{errors.name.message}</p>}
            </div>

            <div>
              <label className='label'>Email address</label>
              <input
                {...register('email')}
                type='email'
                placeholder='you@example.com'
                className={cn('input', errors.email && 'input-error')}
                autoComplete='email'
              />
              {errors.email && <p className='field-error'>{errors.email.message}</p>}
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
            </div>

            <div>
              <label className='label'>Password</label>
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
              <label className='label'>Confirm password</label>
              <input
                {...register('confirmPassword')}
                type='password'
                placeholder='Repeat your password'
                className={cn('input', errors.confirmPassword && 'input-error')}
                autoComplete='new-password'
              />
              {errors.confirmPassword && <p className='field-error'>{errors.confirmPassword.message}</p>}
            </div>

            <button type='submit' disabled={isSubmitting} className='btn-primary w-full mt-1 justify-center'>
              {isSubmitting ? (
                <span className='flex items-center gap-2'>
                  <Spinner variant='white' />
                  Creating account…
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        <p className='mt-6 text-center text-sm text-ob-muted'>
          Already have an account?{' '}
          <Link to='/login' className='font-medium transition-colors text-ob-caramel hover:text-ob-wood'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
