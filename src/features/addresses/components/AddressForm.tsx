import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/utils/cn';
import { Spinner } from '@/components/shared/ui';
import type { Address } from '@/types';

const addressSchema = z.object({
  city: z.string().min(1, 'City is required'),
  street: z.string().min(1, 'Street is required'),
  zip: z.string().min(1, 'ZIP code is required'),
});

export type AddressFormData = z.infer<typeof addressSchema>;

interface AddressFormProps {
  defaultValues?: Partial<Address>;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
  submitLabel?: string;
}

export function AddressForm({ defaultValues, onSubmit, onCancel, isPending, submitLabel = 'Save address' }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      city: defaultValues?.city ?? '',
      street: defaultValues?.street ?? '',
      zip: defaultValues?.zip ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <div>
        <label className='label'>City</label>
        <input {...register('city')} placeholder='e.g. Warsaw' className={cn('input', errors.city && 'input-error')} />
        {errors.city && <p className='field-error'>{errors.city.message}</p>}
      </div>
      <div>
        <label className='label'>Street & number</label>
        <input {...register('street')} placeholder='e.g. ul. Marszałkowska 12' className={cn('input', errors.street && 'input-error')} />
        {errors.street && <p className='field-error'>{errors.street.message}</p>}
      </div>
      <div>
        <label className='label'>ZIP / Postal code</label>
        <input {...register('zip')} placeholder='e.g. 00-001' className={cn('input', errors.zip && 'input-error')} />
        {errors.zip && <p className='field-error'>{errors.zip.message}</p>}
      </div>

      <div className='flex gap-3 justify-end pt-2'>
        <button type='button' onClick={onCancel} className='btn-ghost'>
          Cancel
        </button>
        <button type='submit' disabled={isPending} className='btn-primary'>
          {isPending ? <Spinner variant='white' /> : submitLabel}
        </button>
      </div>
    </form>
  );
}
