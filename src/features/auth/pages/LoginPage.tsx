import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { getErrorMessage } from '@/api/client';
import { cn } from '@/utils/cn';
import { Spinner } from '@/components/shared/ui';

const schema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const { accessToken, user } = await authApi.login(data);
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
