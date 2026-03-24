import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/shared/lib/utils/cn';
import { Spinner } from '@/shared/ui';
import { cardSchema, CARD_TYPES, CARD_ICON, type CardFormData } from '../schemas/paymentCard.schema';

interface AddCardFormProps {
  onSubmit: (data: CardFormData) => Promise<void>;
  onCancel: () => void;
  isPending: boolean;
}

export function AddCardForm({ onSubmit, onCancel, isPending }: AddCardFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      {/* Card type */}
      <div>
        <label className='label'>Card type</label>
        <div className='flex gap-3'>
          {CARD_TYPES.map(type => (
            <label key={type} className='flex-1 cursor-pointer'>
              <input {...register('cardType')} type='radio' value={type} className='sr-only peer' />
              <div className='flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-ob-border text-sm font-medium transition-all peer-checked:border-ob-caramel peer-checked:bg-ob-caramel/5 text-ob-muted peer-checked:text-ob-caramel'>
                <span className='text-xl'>{CARD_ICON[type]}</span>
                {type}
              </div>
            </label>
          ))}
        </div>
        {errors.cardType && <p className='field-error'>{errors.cardType.message}</p>}
      </div>

      {/* Last 4 digits */}
      <div>
        <label className='label'>Last 4 digits</label>
        <input
          {...register('last4')}
          placeholder='1234'
          maxLength={4}
          inputMode='numeric'
          className={cn('input font-mono tracking-widest', errors.last4 && 'input-error')}
        />
        {errors.last4 && <p className='field-error'>{errors.last4.message}</p>}
      </div>

      {/* Expiry */}
      <div className='grid grid-cols-2 gap-3'>
        <div>
          <label className='label'>Expiry month</label>
          {/* valueAsNumber: true — RHF converts the DOM string to a number before
              Zod validation, so z.number() (not z.coerce) sees a real number
              and TypeScript inference stays correct. */}
          <input
            {...register('expMonth', { valueAsNumber: true })}
            type='number'
            placeholder='MM'
            min={1}
            max={12}
            className={cn('input', errors.expMonth && 'input-error')}
          />
          {errors.expMonth && <p className='field-error'>{errors.expMonth.message}</p>}
        </div>
        <div>
          <label className='label'>Expiry year</label>
          <input
            {...register('expYear', { valueAsNumber: true })}
            type='number'
            placeholder='YYYY'
            min={new Date().getFullYear()}
            className={cn('input', errors.expYear && 'input-error')}
          />
          {errors.expYear && <p className='field-error'>{errors.expYear.message}</p>}
        </div>
      </div>

      <div className='flex gap-3 justify-end pt-2'>
        <button type='button' onClick={onCancel} className='btn-ghost'>
          Cancel
        </button>
        <button type='submit' disabled={isPending} className='btn-primary'>
          {isPending ? <Spinner variant='white' /> : 'Add card'}
        </button>
      </div>
    </form>
  );
}
