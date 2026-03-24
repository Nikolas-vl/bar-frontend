import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils/cn';
import { useDeletePaymentMethod, useSetDefaultPaymentMethod } from '../hooks/usePaymentMethodMutations';
import { getErrorMessage } from '@/shared/lib/api/client';
import type { PaymentMethod } from '@/shared/types';

const CARD_ICON: Record<string, string> = {
  Visa: '🟦',
  Mastercard: '🔴',
  Amex: '🟩',
};

function isExpired(expMonth: number, expYear: number): boolean {
  return new Date(expYear, expMonth - 1) < new Date();
}

interface PaymentCardProps {
  card: PaymentMethod;
}

export function PaymentCard({ card }: PaymentCardProps) {
  const { mutate: remove, isPending: isRemoving } = useDeletePaymentMethod();
  const { mutate: setDefault, isPending: isSettingDefault } = useSetDefaultPaymentMethod();

  const expired = isExpired(card.expMonth, card.expYear);
  const isPending = isRemoving || isSettingDefault;

  const handleSetDefault = () => {
    setDefault(card.id, {
      onSuccess: () => toast.success('Default card updated'),
      onError: err => toast.error(getErrorMessage(err)),
    });
  };

  const handleDelete = () => {
    remove(card.id, {
      onSuccess: result => {
        if (result.archived) {
          toast.info('Card archived — it will still show in your past orders', {
            duration: 5000,
          });
        } else {
          toast.success('Card removed');
        }
      },
      onError: err => toast.error(getErrorMessage(err)),
    });
  };

  return (
    <div className={cn('card p-5 flex items-center gap-4 transition-all', card.isDefault && 'border-ob-caramel/40 bg-ob-caramel/3')}>
      <div className='w-12 h-12 rounded-xl bg-ob-blue flex items-center justify-center text-2xl shrink-0'>{CARD_ICON[card.cardType] ?? '💳'}</div>

      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 flex-wrap'>
          <p className='font-medium text-sm text-ob-text'>
            {card.cardType} •••• {card.last4}
          </p>

          {card.isDefault && <span className='px-1.5 py-0.5 rounded text-[10px] font-semibold bg-ob-caramel/12 text-ob-caramel'>Default</span>}

          {expired && <span className='px-1.5 py-0.5 rounded text-[10px] font-semibold bg-ob-error/10 text-ob-error'>Expired</span>}
        </div>

        <p className='text-xs text-ob-muted mt-0.5'>
          Expires {String(card.expMonth).padStart(2, '0')}/{card.expYear}
        </p>
      </div>

      <div className='flex items-center gap-1 shrink-0'>
        {!card.isDefault && (
          <button
            onClick={handleSetDefault}
            disabled={isPending}
            className='text-xs px-3 py-1.5 rounded-xl transition-colors text-ob-muted hover:bg-ob-border hover:text-ob-text font-medium disabled:opacity-40'
            aria-label={`Set ${card.cardType} ending ${card.last4} as default`}
          >
            {isSettingDefault ? '…' : 'Set default'}
          </button>
        )}

        <button
          onClick={handleDelete}
          disabled={isPending}
          className='text-xs px-3 py-1.5 rounded-xl transition-colors text-ob-error hover:bg-ob-error/8 font-medium disabled:opacity-40'
          aria-label={`Remove ${card.cardType} ending ${card.last4}`}
        >
          {isRemoving ? '…' : 'Remove'}
        </button>
      </div>
    </div>
  );
}
