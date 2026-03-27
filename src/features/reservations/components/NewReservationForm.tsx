import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { newReservationSchema, minDateTimeLocal, type NewReservationFormData } from '../schemas/reservation.schema';
import { PreOrderSelector, type PreOrderEntry } from './PreOrderSelector';
import { useCreateReservation } from '../hooks/useCreateReservation';
import { DateTimePicker } from '@/shared/ui/DateTimePicker/DayTimePicker';
import { Spinner } from '@/shared/ui';
import { cn, formatPrice } from '@/shared/lib/utils/cn';
import { getErrorMessage } from '@/shared/lib/api/client';
import type { Dish } from '@/shared/types';

interface NewReservationFormProps {
  dishes: Dish[];
}

export function NewReservationForm({ dishes }: NewReservationFormProps) {
  const navigate = useNavigate();
  const { mutateAsync: createReservation } = useCreateReservation();
  const [preOrders, setPreOrders] = useState<PreOrderEntry[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewReservationFormData>({
    resolver: zodResolver(newReservationSchema),
    defaultValues: { guests: 2 },
  });

  const preOrderSubtotal = preOrders.reduce((sum, e) => sum + parseFloat(e.dish.price) * e.quantity, 0);

  const minDate = new Date(minDateTimeLocal());

  const onSubmit = async (data: NewReservationFormData) => {
    try {
      await createReservation({
        date: new Date(data.date).toISOString(),
        guests: data.guests,
        comment: data.comment?.trim() || undefined,
        preOrders: preOrders.map(e => ({ dishId: e.dishId, quantity: e.quantity })),
      });
      toast.success('Reservation confirmed! See you soon ☕');
      navigate('/reservations');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      {/* Date & time — custom picker, no browser OS chrome */}
      <div>
        <label className='label'>Date & Time</label>
        <Controller
          name='date'
          control={control}
          render={({ field }) => <DateTimePicker value={field.value ?? ''} onChange={field.onChange} minDate={minDate} hasError={!!errors.date} />}
        />
        {errors.date && <p className='field-error'>{errors.date.message}</p>}
      </div>

      {/* Guests */}
      <div>
        <label className='label'>Number of Guests</label>
        <input
          {...register('guests', { valueAsNumber: true })}
          type='number'
          min={1}
          max={50}
          className={cn('input', errors.guests && 'input-error')}
        />
        {errors.guests && <p className='field-error'>{errors.guests.message}</p>}
      </div>

      {/* Comment */}
      <div>
        <label className='label'>
          Special Requests <span className='text-ob-light font-normal'>(optional)</span>
        </label>
        <textarea
          {...register('comment')}
          placeholder='E.g. window seat, high chair, birthday celebration…'
          maxLength={500}
          rows={3}
          className='textarea w-full'
        />
      </div>

      {/* Pre-orders */}
      <div>
        <label className='label'>
          Pre-order Dishes <span className='text-ob-light font-normal'>(optional)</span>
        </label>
        <p className='text-xs text-ob-muted mb-3'>Dishes will be prepared and ready at your table when you arrive.</p>
        <PreOrderSelector dishes={dishes} entries={preOrders} onChange={setPreOrders} />
      </div>

      {preOrders.length > 0 && (
        <div className='card p-4 flex justify-between items-center text-sm'>
          <span className='text-ob-muted'>Pre-order subtotal</span>
          <span className='font-display font-semibold text-ob-caramel'>{formatPrice(preOrderSubtotal.toFixed(2))}</span>
        </div>
      )}

      <button type='submit' disabled={isSubmitting} className='btn-primary w-full justify-center text-base py-3.5'>
        {isSubmitting ? (
          <span className='flex items-center gap-2'>
            <Spinner variant='white' />
            Booking…
          </span>
        ) : (
          'Confirm Reservation'
        )}
      </button>
    </form>
  );
}
