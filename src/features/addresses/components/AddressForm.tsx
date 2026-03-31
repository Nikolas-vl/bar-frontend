import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/shared/lib/utils/cn';
import { Spinner } from '@/shared/ui';
import { AddressFormSchema, type AddressFormData } from '../schemas/addresse.schema';

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel?: () => void;
  isPending?: boolean;
  submitLabel?: string;
}

export function AddressForm({ defaultValues, onSubmit, onCancel, isPending = false, submitLabel = 'Save address' }: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<AddressFormData>({
    resolver: zodResolver(AddressFormSchema),
    mode: 'onTouched',
    defaultValues,
  });

  const busy = isSubmitting || isPending;
  const submitDisabled = busy || !isValid;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <div>
        <label className='label'>City</label>
        <input {...register('city')} placeholder='e.g. Warsaw' className={cn('input', errors.city && 'input-error')} />
        {errors.city && <p className='field-error'>{errors.city.message}</p>}
      </div>

      <div>
        <label className='label'>Street &amp; number</label>
        <input {...register('street')} placeholder='e.g. ul. Marszałkowska 12' className={cn('input', errors.street && 'input-error')} />
        {errors.street && <p className='field-error'>{errors.street.message}</p>}
      </div>

      <div>
        <label className='label'>ZIP / Postal code</label>
        <input {...register('zip')} placeholder='e.g. 00-001' maxLength={6} className={cn('input', errors.zip && 'input-error')} />
        {errors.zip && <p className='field-error'>{errors.zip.message}</p>}
        {!errors.zip && <p className='mt-1 text-xs text-ob-muted'>Polish format: XX-XXX (e.g. 00-001)</p>}
      </div>

      <div className='flex gap-3 justify-end pt-2'>
        {onCancel && (
          <button type='button' onClick={onCancel} className='btn-ghost'>
            Cancel
          </button>
        )}
        <button type='submit' disabled={submitDisabled} className='btn-primary'>
          {busy ? (
            <span className='flex items-center gap-2'>
              <Spinner variant='white' />
              Saving…
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </form>
  );
}
