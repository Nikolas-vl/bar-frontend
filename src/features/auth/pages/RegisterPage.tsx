import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { authApi } from '../../../api/auth.api';
import { useAuthStore } from '../../../store/auth.store';
import { getErrorMessage } from '../../../api/client';
import { cn } from '../../../utils/cn';

const schema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const { accessToken, user } = await authApi.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(user, accessToken);
      toast.success(`Welcome to OceanBar, ${user.name}!`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className='min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12'>
      <div className='w-full max-w-sm animate-slide-up'>
        <div className='text-center mb-8'>
          <h1 className='font-display text-3xl font-semibold text-white mb-2'>Create account</h1>
          <p className='text-sm text-slate-400 font-body'>Join OceanBar and start ordering</p>
        </div>

        <div className='card p-6 shadow-ocean-lg'>
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <div>
              <label className='block text-sm font-body font-medium text-slate-300 mb-1.5'>Name</label>
              <input
                {...register('name')}
                placeholder='Your name'
                className={cn('input', errors.name && 'border-red-500/50 focus:ring-red-500')}
                autoComplete='name'
              />
              {errors.name && <p className='mt-1 text-xs text-red-400 font-body'>{errors.name.message}</p>}
            </div>

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
                placeholder='At least 6 characters'
                className={cn('input', errors.password && 'border-red-500/50 focus:ring-red-500')}
                autoComplete='new-password'
              />
              {errors.password && <p className='mt-1 text-xs text-red-400 font-body'>{errors.password.message}</p>}
            </div>

            <div>
              <label className='block text-sm font-body font-medium text-slate-300 mb-1.5'>Confirm password</label>
              <input
                {...register('confirmPassword')}
                type='password'
                placeholder='Repeat your password'
                className={cn('input', errors.confirmPassword && 'border-red-500/50 focus:ring-red-500')}
                autoComplete='new-password'
              />
              {errors.confirmPassword && <p className='mt-1 text-xs text-red-400 font-body'>{errors.confirmPassword.message}</p>}
            </div>

            <button type='submit' disabled={isSubmitting} className='btn-primary w-full mt-1'>
              {isSubmitting ? (
                <span className='flex items-center gap-2'>
                  <span className='w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin' />
                  Creating account…
                </span>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>

        <p className='mt-6 text-center text-sm text-slate-500 font-body'>
          Already have an account?{' '}
          <Link to='/login' className='text-ocean-400 hover:text-ocean-300 transition-colors'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
