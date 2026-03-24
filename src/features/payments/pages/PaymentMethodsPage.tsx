import { useState } from 'react';
import { toast } from 'sonner';
import { ProfileLayout } from '../../profile/components/ProfileLayout';
import { PaymentCard } from '@/features/payments/components/PaymentCard';
import { AddCardForm } from '@/features/payments/components/AddCardForm';
import { usePaymentMethods } from '@/features/payments/hooks/usePaymentMethods';
import { useCreatePaymentMethod } from '@/features/payments/hooks/usePaymentMethodMutations';
import { getErrorMessage } from '@/shared/lib/api/client';
import { Skeleton } from '@/shared/ui';
import type { CardFormData } from '../schemas/paymentCard.schema';

export default function PaymentMethodsPage() {
  const [isAdding, setIsAdding] = useState(false);
  const { data: cards, isLoading } = usePaymentMethods();
  const { mutateAsync: create, isPending: isCreating } = useCreatePaymentMethod();

  const handleCreate = async (data: CardFormData) => {
    try {
      await create(data);
      toast.success('Card added');
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
            <h2 className='font-display text-xl font-semibold text-ob-text'>Payment Methods</h2>
            <p className='text-sm text-ob-muted mt-0.5'>Saved cards for quick checkout</p>
          </div>
          {!isAdding && (
            <button onClick={() => setIsAdding(true)} className='btn-primary text-sm'>
              + Add card
            </button>
          )}
        </div>

        {/* Add form */}
        {isAdding && (
          <div className='card p-5'>
            <h3 className='font-semibold text-sm text-ob-text mb-4'>New Card</h3>
            <AddCardForm onSubmit={handleCreate} onCancel={() => setIsAdding(false)} isPending={isCreating} />
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className='flex flex-col gap-3'>
            {[1, 2].map(i => (
              <Skeleton key={i} className='h-20 rounded-2xl' />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && cards?.length === 0 && !isAdding && (
          <div className='card p-10 flex flex-col items-center gap-3 text-center'>
            <span className='text-4xl'>💳</span>
            <p className='font-semibold text-ob-text'>No cards saved</p>
            <p className='text-sm text-ob-muted'>Save a card to pay faster at checkout</p>
            <button onClick={() => setIsAdding(true)} className='btn-primary mt-2 text-sm'>
              Add your first card
            </button>
          </div>
        )}

        {!isLoading && cards && cards.length > 0 && (
          <div className='flex flex-col gap-3'>
            {cards.map(card => (
              <PaymentCard key={card.id} card={card} />
            ))}
          </div>
        )}

        {!isLoading && (
          <div className='rounded-xl bg-ob-blue border border-ob-blue-deep px-4 py-3 flex gap-3 mt-2'>
            <span className='text-lg shrink-0'>🔒</span>
            <div>
              <p className='text-xs font-semibold text-ob-text'>Secure storage</p>
              <p className='text-xs text-ob-muted leading-relaxed mt-0.5'>
                Only the last 4 digits and expiry are stored. Full card details are never saved on our servers.
              </p>
            </div>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
