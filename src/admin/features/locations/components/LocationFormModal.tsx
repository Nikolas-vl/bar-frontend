import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { AdminModal } from '@/admin/components/AdminModal';
import { Spinner } from '@/shared/ui';
import type { Location } from '@/shared/types';
import { locationSchema, type LocationFormInput, type LocationFormOutput } from '../schemas/location.schema';
import { mapLocationToForm, mapLocationFormToDto } from '../mappers/location.mapper';
import type { CreateLocationDto } from '../dto/location.dto';

interface LocationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: Location | null;
  onSubmit: (data: CreateLocationDto) => void;
  isPending: boolean;
}

export function LocationFormModal({ isOpen, onClose, location, onSubmit, isPending }: LocationFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LocationFormInput, unknown, LocationFormOutput>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      email: '',
      openingHours: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (location) {
        reset(mapLocationToForm(location));
      } else {
        reset({ name: '', address: '', phone: '', email: '', openingHours: '', isActive: true });
      }
    }
  }, [isOpen, location, reset]);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={location ? 'Edit Location' : 'New Location'}
      footer={
        <>
          <button type='button' className='btn-ghost' onClick={onClose} disabled={isPending}>
            Cancel
          </button>
          <button type='submit' form='location-form' className='btn-primary inline-flex items-center gap-2' disabled={isPending}>
            {isPending && <Spinner variant='white' size='sm' />}
            {location ? 'Save Changes' : 'Create Location'}
          </button>
        </>
      }
    >
      <form id='location-form' onSubmit={handleSubmit(data => onSubmit(mapLocationFormToDto(data)))} className='space-y-4'>
        <div className='space-y-1.5'>
          <label htmlFor='loc-name' className='label'>
            Name
          </label>
          <input id='loc-name' type='text' className={errors.name ? 'input input-error' : 'input'} {...register('name')} />
          {errors.name && <p className='field-error'>{errors.name.message}</p>}
        </div>

        <div className='space-y-1.5'>
          <label htmlFor='loc-address' className='label'>
            Address
          </label>
          <input id='loc-address' type='text' className={errors.address ? 'input input-error' : 'input'} {...register('address')} />
          {errors.address && <p className='field-error'>{errors.address.message}</p>}
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <label htmlFor='loc-phone' className='label'>
              Phone
            </label>
            <input id='loc-phone' type='text' className={errors.phone ? 'input input-error' : 'input'} {...register('phone')} />
            {errors.phone && <p className='field-error'>{errors.phone.message}</p>}
          </div>
          <div className='space-y-1.5'>
            <label htmlFor='loc-email' className='label'>
              Email
            </label>
            <input id='loc-email' type='email' className={errors.email ? 'input input-error' : 'input'} {...register('email')} />
            {errors.email && <p className='field-error'>{errors.email.message}</p>}
          </div>
        </div>

        <div className='space-y-1.5'>
          <label htmlFor='loc-hours' className='label'>
            Opening Hours
          </label>
          <input
            id='loc-hours'
            type='text'
            placeholder='e.g. 08:00 – 22:00'
            className={errors.openingHours ? 'input input-error' : 'input'}
            {...register('openingHours')}
          />
          {errors.openingHours && <p className='field-error'>{errors.openingHours.message}</p>}
        </div>

        <label className='flex items-center gap-2 cursor-pointer'>
          <input type='checkbox' {...register('isActive')} className='accent-ob-caramel w-4 h-4' />
          <span className='text-sm text-ob-text'>Active</span>
        </label>
      </form>
    </AdminModal>
  );
}
