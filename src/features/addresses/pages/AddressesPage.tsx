import { useState } from 'react';
import { toast } from 'sonner';
import { ProfileLayout } from '../../profile/components/ProfileLayout';
import { AddressCard } from '../components/AddressCard';
import { AddressForm } from '../components/AddressForm';
import { useAddresses, useCreateAddress } from '../hooks/useAddresses';
import { getErrorMessage } from '@/shared/lib/api/client';
import { Skeleton } from '@/shared/ui';
import type { AddressFormData } from '../schemas/addresses.schema';

export default function AddressesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const { data: addresses, isLoading } = useAddresses();
  const { mutateAsync: create, isPending: isCreating } = useCreateAddress();

  const handleCreate = async (data: AddressFormData) => {
    try {
      await create(data);
      toast.success('Address added');
      setIsAdding(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <ProfileLayout>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='font-display text-xl font-semibold text-ob-text'>Delivery Addresses</h2>
            <p className='text-sm text-ob-muted mt-0.5'>Manage your saved delivery locations</p>
          </div>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className='btn-primary text-sm'>
              + Add address
            </button>
          )}
        </div>

        {isAdding && (
          <div className='card p-5'>
            <h3 className='font-semibold text-sm text-ob-text mb-4'>New Address</h3>
            <AddressForm onSubmit={handleCreate} onCancel={() => setIsAdding(false)} isPending={isCreating} submitLabel='Add address' />
          </div>
        )}

        {isLoading && (
          <div className='flex flex-col gap-3'>
            {[1, 2].map(i => (
              <Skeleton key={i} className='h-20 rounded-2xl' />
            ))}
          </div>
        )}

        {!isLoading && addresses?.length === 0 && !isAdding && (
          <div className='card p-10 flex flex-col items-center gap-3 text-center'>
            <span className='text-4xl'>📍</span>
            <p className='font-semibold text-ob-text'>No addresses yet</p>
            <p className='text-sm text-ob-muted'>Add a delivery address to speed up checkout</p>
            <button onClick={() => setIsAdding(true)} className='btn-primary mt-2 text-sm'>
              Add your first address
            </button>
          </div>
        )}

        {!isLoading && addresses && addresses.length > 0 && (
          <div className='flex flex-col gap-3'>
            {addresses.map(addr => (
              <AddressCard key={addr.id} address={addr} />
            ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
