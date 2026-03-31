import { useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { authApi } from '@/shared/lib/api/auth.api';
import { useAuthStore } from '@/app/store/auth.store';
import { getErrorMessage } from '@/shared/lib/api/client';
import { cn } from '@/shared/lib/utils/cn';
import { Spinner } from '@/shared/ui';
import { loginSchema, type LoginFormOutput } from '../schemas/auth.schema';
import { mapLoginFormToDto } from '../mappers/auth.mapper';
import { GoogleAuthButton } from '../components/GoogleAuthButton';

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'google_auth_failed') {
      toast.error('Google authentication failed. Please try again.');
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormOutput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormOutput) => {
    try {
      const { accessToken, user } = await authApi.login(mapLoginFormToDto(data));
      setAuth(user, accessToken);
      toast.success(`Welcome back${user.name ? `, ${user.name}` : ''}!`);
      navigate(user.role === 'ADMIN' ? '/admin' : from, { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-ob-bg'>
      <div className='w-full max-w-sm animate-slide-up'>
        <div className='text-center mb-8'>
          <div className='w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-ob-blue'>
            <span className='text-2xl'>☕</span>
          </div>
          <h1 className='font-display text-3xl font-semibold mb-2 text-ob-text'>Welcome back</h1>
          <p className='text-sm text-ob-muted'>Sign in to your Jolie account</p>
        </div>

        <div className='card p-7'>
          <GoogleAuthButton />

          <div className='auth-divider'>
            <span>or</span>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
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
              <label className='label'>Password</label>
              <input
                {...register('password')}
                type='password'
                placeholder='Your password'
                className={cn('input', errors.password && 'input-error')}
                autoComplete='current-password'
              />
              {errors.password && <p className='field-error'>{errors.password.message}</p>}
            </div>

            <button type='submit' disabled={isSubmitting} className='btn-primary w-full mt-1 justify-center'>
              {isSubmitting ? (
                <span className='flex items-center gap-2'>
                  <Spinner variant='white' />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className='mt-6 text-center text-sm text-ob-muted'>
          Don't have an account?{' '}
          <Link to='/register' className='font-medium transition-colors text-ob-caramel hover:text-ob-wood'>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
