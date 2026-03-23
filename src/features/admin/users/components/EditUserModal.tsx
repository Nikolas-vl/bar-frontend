import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { AdminModal } from '@/features/admin/components/AdminModal';
import { Spinner } from '@/components/shared/ui';
import { Select } from '@/components/shared/ui';
import type { AdminUserWithDate } from '@/api/admin/users.api';

const editUserSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(6, 'Min 6 characters').optional().or(z.literal('')),
  role: z.enum(['USER', 'ADMIN']),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUserWithDate | null;
  onSubmit: (data: EditUserFormData) => void;
  isPending: boolean;
}

export function EditUserModal({ isOpen, onClose, user, onSubmit, isPending }: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: { name: '', phone: '', password: '', role: 'USER' },
  });

  const currentRole = watch('role');

  useEffect(() => {
    if (isOpen && user) {
      reset({
        name: user.name ?? '',
        phone: user.phone ?? '',
        password: '',
        role: user.role,
      });
    }
  }, [isOpen, user, reset]);

  const handleFormSubmit = (data: EditUserFormData) => {
    const cleaned: Record<string, string | undefined> = {};
    if (data.name && data.name !== user?.name) cleaned.name = data.name;
    if (data.phone && data.phone !== user?.phone) cleaned.phone = data.phone;
    if (data.password) cleaned.password = data.password;
    if (data.role !== user?.role) cleaned.role = data.role;
    onSubmit(cleaned as EditUserFormData);
  };

  const roleOptions = [
    { value: 'USER', label: 'User' },
    { value: 'ADMIN', label: 'Admin' },
  ];

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title='Edit User'
      footer={
        <>
          <button type='button' className='btn-ghost' onClick={onClose} disabled={isPending}>Cancel</button>
          <button type='submit' form='edit-user-form' className='btn-primary inline-flex items-center gap-2' disabled={isPending}>
            {isPending && <Spinner variant='white' size='sm' />}
            Save Changes
          </button>
        </>
      }
    >
      <form id='edit-user-form' onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
        <div className='space-y-1.5'>
          <label htmlFor='user-email' className='label'>Email</label>
          <input id='user-email' type='text' value={user?.email ?? ''} disabled className='input opacity-50' />
        </div>

        <div className='space-y-1.5'>
          <label htmlFor='user-name' className='label'>Name</label>
          <input id='user-name' type='text' className={errors.name ? 'input input-error' : 'input'} {...register('name')} />
          {errors.name && <p className='field-error'>{errors.name.message}</p>}
        </div>

        <div className='space-y-1.5'>
          <label htmlFor='user-phone' className='label'>Phone</label>
          <input id='user-phone' type='text' className={errors.phone ? 'input input-error' : 'input'} {...register('phone')} />
          {errors.phone && <p className='field-error'>{errors.phone.message}</p>}
        </div>

        <div className='space-y-1.5'>
          <label htmlFor='user-password' className='label'>New Password</label>
          <input id='user-password' type='password' placeholder='Leave blank to keep current' className={errors.password ? 'input input-error' : 'input'} {...register('password')} />
          {errors.password && <p className='field-error'>{errors.password.message}</p>}
        </div>

        <div className='space-y-1.5'>
          <label className='label'>Role</label>
          <Select
            value={currentRole}
            onChange={v => setValue('role', v as 'USER' | 'ADMIN', { shouldValidate: true })}
            options={roleOptions}
          />
        </div>
      </form>
    </AdminModal>
  );
}
