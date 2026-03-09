import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { authApi } from '../../../api/auth.api';
import { useAuthStore } from '../../../store/auth.store';
import { getErrorMessage } from '../../../api/client';
import { cn } from '../../../utils/cn';

const schema = z.object({
  email: z.string().email('Invalid email address'),
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
    <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-sm animate-slide-up'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='font-display text-3xl font-semibold text-white mb-2'>Welcome back</h1>
          <p className='text-sm text-slate-400 font-body'>Sign in to your OceanBar account</p>
        </div>

        {/* Form */}
        <div className='card p-6 shadow-ocean-lg'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-body font-medium text-slate-300 mb-1.5'>Email</label>
              <input
                {...register('email')}
                type='email'
                placeholder='you@example.com'
                className={cn('input', errors.email && 'border-red-500/50 focus:ring-red-500')}
                autoComplete='email'
              />
              {errors.email && <p className='mt-1 text-xs text-red-400 font-body'>{errors.email.message}</p>}
            </div>

            <div>
              <label className='block text-sm font-body font-medium text-slate-300 mb-1.5'>Password</label>
              <input
                {...register('password')}
                type='password'
                placeholder='••••••••'
                className={cn('input', errors.password && 'border-red-500/50 focus:ring-red-500')}
                autoComplete='current-password'
              />
              {errors.password && <p className='mt-1 text-xs text-red-400 font-body'>{errors.password.message}</p>}
            </div>

            <button type='submit' disabled={isSubmitting} className='btn-primary w-full mt-1'>
              {isSubmitting ? (
                <span className='flex items-center gap-2'>
                  <span className='w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin' />
                  Signing in…
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>

        <p className='mt-6 text-center text-sm text-slate-500 font-body'>
          Don't have an account?{' '}
          <Link to='/register' className='text-ocean-400 hover:text-ocean-300 transition-colors'>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
