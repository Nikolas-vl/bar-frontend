import { useState } from 'react';
import { toast } from 'sonner';
import { AddressForm, type AddressFormData } from './AddressForm';
import { useUpdateAddress, useDeleteAddress } from '../hooks/useAddresses';
import { getErrorMessage } from '@/api/client';
import type { Address } from '@/types';

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: update, isPending: isUpdating } = useUpdateAddress();
  const { mutate: remove, isPending: isDeleting } = useDeleteAddress();

  const handleUpdate = async (data: AddressFormData) => {
    try {
      await update({ id: address.id, ...data });
      toast.success('Address updated');
      setIsEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = () => {
    remove(address.id, {
      onSuccess: () => toast.success('Address removed'),
      onError: err => toast.error(getErrorMessage(err)),
    });
  };

  if (isEditing) {
    return (
      <div className='card p-5'>
        <h3 className='font-semibold text-sm text-ob-text mb-4'>Edit Address</h3>
        <AddressForm
          defaultValues={address}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isPending={isUpdating}
          submitLabel='Update address'
        />
      </div>
    );
  }

  return (
    <div className='card p-5 flex items-start justify-between gap-4'>
      <div className='flex items-start gap-3'>
        <span className='text-xl shrink-0 mt-0.5'>📍</span>
        <div>
          <p className='font-medium text-sm text-ob-text'>{address.street}</p>
          <p className='text-sm text-ob-muted'>
            {address.zip} {address.city}
          </p>
        </div>
      </div>

      <div className='flex items-center gap-2 shrink-0'>
        <button onClick={() => setIsEditing(true)} className='btn-ghost text-xs px-3 py-1.5' aria-label='Edit address'>
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className='text-xs px-3 py-1.5 rounded-xl transition-colors text-ob-error hover:bg-ob-error/8 font-medium'
          aria-label='Delete address'
        >
          {isDeleting ? '…' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
