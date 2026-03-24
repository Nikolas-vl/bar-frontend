import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { AdminModal } from '@/admin/components/AdminModal';
import { Select, Spinner, DateTimePicker } from '@/shared/ui';
import { useAdminTables } from '@/admin/features/tables/hooks/useAdminTables';
import type { Reservation } from '@/shared/types/reservation.types';
import { adminReservationSchema, type AdminReservationFormInput, type AdminReservationFormOutput } from '../schemas/reservation.schema';
import { mapAdminReservationToForm, mapAdminReservationFormToDto, mapAdminReservationFormToUpdateDto } from '../mappers/reservation.mapper';
import type { CreateReservationDto, UpdateReservationDto } from '../dto/reservation.dto';

interface AdminReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onSubmitCreate: (data: CreateReservationDto) => void;
  onSubmitUpdate: (data: Omit<UpdateReservationDto, 'userId'>) => void;
  isPending: boolean;
  error?: string | null;
}

export function AdminReservationModal({
  isOpen,
  onClose,
  reservation,
  onSubmitCreate,
  onSubmitUpdate,
  isPending,
  error,
}: AdminReservationModalProps) {
  const { data: tables } = useAdminTables();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<AdminReservationFormInput, unknown, AdminReservationFormOutput>({
    resolver: zodResolver(adminReservationSchema),
    defaultValues: {
      userId: '',
      date: '',
      guests: 1,
      tableId: undefined,
      status: 'PENDING',
      comment: '',
    },
  });

  const currentStatus = useWatch({ control, name: 'status' });
  const currentTableId = useWatch({ control, name: 'tableId' });

  useEffect(() => {
    if (isOpen) {
      if (reservation) {
        reset(mapAdminReservationToForm(reservation));
      } else {
        reset({
          userId: '',
          date: '',
          guests: 1,
          tableId: undefined,
          status: 'PENDING',
          comment: '',
        });
      }
    }
  }, [isOpen, reservation, reset]);

  const isEdit = !!reservation;

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'CANCELED', label: 'Canceled' },
  ];

  const tableOptions = [
    { value: '0', label: 'No table assigned' },
    ...(tables ?? []).map(t => ({
      value: String(t.id),
      label: `Table #${t.number} (${t.capacity} seats) — ${t.location?.name ?? 'Unknown'}`,
    })),
  ];

  const onSubmit = (data: AdminReservationFormOutput) => {
    if (isEdit) {
      onSubmitUpdate(mapAdminReservationFormToUpdateDto(data));
    } else {
      onSubmitCreate(mapAdminReservationFormToDto(data));
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Reservation' : 'New Reservation'}
      size='md'
      footer={
        <>
          <button type='button' className='btn-ghost' onClick={onClose} disabled={isPending}>
            Cancel
          </button>
          <button type='submit' form='reservation-form' className='btn-primary inline-flex items-center gap-2' disabled={isPending}>
            {isPending && <Spinner variant='white' size='sm' />}
            {isEdit ? 'Save Changes' : 'Create Reservation'}
          </button>
        </>
      }
    >
      <form id='reservation-form' onSubmit={handleSubmit(onSubmit)} className='space-y-4 text-left'>
        {error && <div className='rounded-xl bg-ob-error/10 border border-ob-error/30 px-4 py-3 text-sm text-ob-error font-medium'>{error}</div>}
        <div className='space-y-1.5'>
          <label htmlFor='res-userId' className='label'>
            User ID {!isEdit && '*'}
          </label>
          <input
            id='res-userId'
            type='number'
            min='1'
            className={errors.userId ? 'input input-error' : 'input'}
            disabled={isEdit}
            {...register('userId')}
          />
          {errors.userId && <p className='field-error'>{errors.userId.message}</p>}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <label className='label'>Date & Time *</label>
            <Controller
              name='date'
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  minDate={isEdit ? undefined : new Date()}
                  hasError={!!errors.date}
                />
              )}
            />
            {errors.date && <p className='field-error'>{errors.date.message}</p>}
          </div>

          <div className='space-y-1.5'>
            <label htmlFor='res-guests' className='label'>
              Guests *
            </label>
            <input id='res-guests' type='number' min='1' className={errors.guests ? 'input input-error' : 'input'} {...register('guests')} />
            {errors.guests && <p className='field-error'>{errors.guests.message}</p>}
          </div>
        </div>

        <div className='space-y-1.5'>
          <label className='label'>Table</label>
          <Select
            value={String(currentTableId ?? 0)}
            onChange={v => setValue('tableId', Number(v), { shouldValidate: true })}
            options={tableOptions}
            placeholder='Select table'
          />
        </div>

        <div className='space-y-1.5'>
          <label className='label'>Status</label>
          <Select
            value={currentStatus}
            onChange={v => setValue('status', v as AdminReservationFormOutput['status'], { shouldValidate: true })}
            options={statusOptions}
          />
        </div>

        <div className='space-y-1.5'>
          <label htmlFor='res-comment' className='label'>
            Comment
          </label>
          <textarea id='res-comment' className='textarea' rows={3} {...register('comment')} />
        </div>
      </form>
    </AdminModal>
  );
}
