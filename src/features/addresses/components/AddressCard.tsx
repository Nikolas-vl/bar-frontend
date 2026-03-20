import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import { AddressForm, type AddressFormData } from './AddressForm';
import { useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from '../hooks/useAddresses';
import { getErrorMessage } from '@/api/client';
import type { Address } from '@/types';

interface AddressCardProps {
  address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: update, isPending: isUpdating } = useUpdateAddress();
  const { mutate: remove, isPending: isRemoving } = useDeleteAddress();
  const { mutate: setDefault, isPending: isSettingDefault } = useSetDefaultAddress();

  const isPending = isUpdating || isRemoving || isSettingDefault;

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

  const handleSetDefault = () => {
    setDefault(address.id, {
      onSuccess: () => toast.success('Default address updated'),
      onError: err => toast.error(getErrorMessage(err)),
    });
  };

  if (isEditing) {
    return (
      <div className='card p-5'>
        <h3 className='font-semibold text-sm text-ob-text mb-4'>Edit Address</h3>
        <AddressForm
          defaultValues={{ city: address.city, street: address.street, zip: address.zip }}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          isPending={isUpdating}
          submitLabel='Update address'
        />
      </div>
    );
  }

  return (
    <div
      className={cn('card p-5 flex items-start justify-between gap-4 transition-all', address.isDefault && 'border-ob-caramel/40 bg-ob-caramel/3')}
    >
      {/* Info */}
      <div className='flex items-start gap-3'>
        <span className='text-xl shrink-0 mt-0.5'>📍</span>
        <div>
          <div className='flex items-center gap-2 flex-wrap mb-0.5'>
            <p className='font-medium text-sm text-ob-text'>{address.street}</p>
            {address.isDefault && (
              <span className='px-1.5 py-0.5 rounded text-[10px] font-semibold bg-ob-caramel/12 text-ob-caramel leading-none'>Default</span>
            )}
          </div>
          <p className='text-sm text-ob-muted'>
            {address.zip} {address.city}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className='flex items-center gap-1 shrink-0'>
        {!address.isDefault && (
          <button
            onClick={handleSetDefault}
            disabled={isPending}
            className='text-xs px-3 py-1.5 rounded-xl transition-colors text-ob-muted hover:bg-ob-border hover:text-ob-text font-medium disabled:opacity-40'
          >
            {isSettingDefault ? '…' : 'Set default'}
          </button>
        )}
        <button onClick={() => setIsEditing(true)} disabled={isPending} className='btn-ghost text-xs px-3 py-1.5 disabled:opacity-40'>
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className='text-xs px-3 py-1.5 rounded-xl transition-colors text-ob-error hover:bg-ob-error/8 font-medium disabled:opacity-40'
        >
          {isRemoving ? '…' : 'Remove'}
        </button>
      </div>
    </div>
  );
}
