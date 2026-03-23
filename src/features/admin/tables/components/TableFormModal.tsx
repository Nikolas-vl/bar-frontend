import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { AdminModal } from '@/features/admin/components/AdminModal';
import { Spinner } from '@/components/shared/ui';
import { Select } from '@/components/shared/ui';
import type { Table, Location } from '@/types';

const tableSchema = z.object({
  number: z.coerce.number().int().positive('Must be a positive integer'),
  capacity: z.coerce.number().int().min(1, 'Min capacity is 1'),
  locationId: z.coerce.number().int().positive('Select a location'),
});

type TableFormData = z.infer<typeof tableSchema>;

interface TableFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  table: Table | null;
  locations: Location[];
  onSubmit: (data: TableFormData) => void;
  isPending: boolean;
}

export function TableFormModal({ isOpen, onClose, table, locations, onSubmit, isPending }: TableFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: { number: 1, capacity: 2, locationId: 0 },
  });

  const currentLocationId = watch('locationId');

  useEffect(() => {
    if (isOpen) {
      if (table) {
        reset({ number: table.number, capacity: table.capacity, locationId: table.locationId });
      } else {
        reset({ number: 1, capacity: 2, locationId: locations[0]?.id ?? 0 });
      }
    }
  }, [isOpen, table, locations, reset]);

  const locationOptions = locations.map(l => ({ value: String(l.id), label: l.name }));

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={table ? 'Edit Table' : 'New Table'}
      size='sm'
      footer={
        <>
          <button type='button' className='btn-ghost' onClick={onClose} disabled={isPending}>
            Cancel
          </button>
          <button
            type='submit'
            form='table-form'
            className='btn-primary inline-flex items-center gap-2'
            disabled={isPending}
          >
            {isPending && <Spinner variant='white' size='sm' />}
            {table ? 'Save' : 'Create Table'}
          </button>
        </>
      }
    >
      <form id='table-form' onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <label htmlFor='table-number' className='label'>Table Number</label>
            <input id='table-number' type='number' min='1' className={errors.number ? 'input input-error' : 'input'} {...register('number')} />
            {errors.number && <p className='field-error'>{errors.number.message}</p>}
          </div>
          <div className='space-y-1.5'>
            <label htmlFor='table-capacity' className='label'>Capacity</label>
            <input id='table-capacity' type='number' min='1' className={errors.capacity ? 'input input-error' : 'input'} {...register('capacity')} />
            {errors.capacity && <p className='field-error'>{errors.capacity.message}</p>}
          </div>
        </div>

        <div className='space-y-1.5'>
          <label className='label'>Location</label>
          <Select
            value={String(currentLocationId)}
            onChange={v => setValue('locationId', Number(v), { shouldValidate: true })}
            options={locationOptions}
            placeholder='Select location'
          />
          {errors.locationId && <p className='field-error'>{errors.locationId.message}</p>}
        </div>
      </form>
    </AdminModal>
  );
}
