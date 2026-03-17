import { cn } from '@/utils/cn';
import type { PaymentMethod, PaymentType } from '@/types';

const METHODS: { value: PaymentType; label: string; icon: string }[] = [
  { value: 'CASH', label: 'Cash', icon: '💵' },
  { value: 'BLIK', label: 'BLIK', icon: '📱' },
  { value: 'CARD', label: 'Card', icon: '💳' },
];

interface PaymentMethodSelectorProps {
  paymentType: PaymentType;
  paymentMethodId: number | null;
  savedCards: PaymentMethod[];
  onTypeChange: (type: PaymentType) => void;
  onCardChange: (id: number) => void;
}

export function PaymentMethodSelector({ paymentType, paymentMethodId, savedCards, onTypeChange, onCardChange }: PaymentMethodSelectorProps) {
  return (
    <div className='flex flex-col gap-4'>
      {/* Payment type pills */}
      <div className='flex gap-2'>
        {METHODS.map(m => (
          <button
            key={m.value}
            type='button'
            onClick={() => onTypeChange(m.value)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all',
              paymentType === m.value
                ? 'border-ob-caramel bg-ob-caramel/5 text-ob-caramel'
                : 'border-ob-border text-ob-muted hover:border-ob-caramel/40',
            )}
          >
            <span>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Saved cards — only when CARD is selected */}
      {paymentType === 'CARD' && (
        <div className='flex flex-col gap-2'>
          {savedCards.length === 0 ? (
            <p className='text-xs text-ob-muted bg-ob-bg rounded-xl p-3'>No saved cards. Please add a payment method in your profile.</p>
          ) : (
            savedCards.map(card => (
              <button
                key={card.id}
                type='button'
                onClick={() => onCardChange(card.id)}
                className={cn(
                  'flex items-center justify-between p-3 rounded-xl border text-sm transition-all',
                  paymentMethodId === card.id ? 'border-ob-caramel bg-ob-caramel/5' : 'border-ob-border hover:border-ob-caramel/40',
                )}
              >
                <span className='font-medium text-ob-text'>
                  {card.cardType} •••• {card.last4}
                </span>
                <span className='text-ob-muted text-xs'>
                  {card.expMonth}/{card.expYear}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
