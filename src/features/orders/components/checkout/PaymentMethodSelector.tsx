import { cn } from '@/shared/lib/utils/cn';
import type { PaymentMethod, PaymentType } from '@/shared/types';

const METHODS: { value: PaymentType; label: string; icon: string }[] = [
  { value: 'CASH', label: 'Cash', icon: '💵' },
  { value: 'BLIK', label: 'BLIK', icon: '📱' },
  { value: 'CARD', label: 'Card', icon: '💳' },
];

const CARD_ICON: Record<string, string> = {
  Visa: '🟦',
  Mastercard: '🔴',
  Amex: '🟩',
};

function isExpired(expMonth: number, expYear: number): boolean {
  return new Date(expYear, expMonth - 1) < new Date();
}

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
            savedCards.map(card => {
              const selected = paymentMethodId === card.id;
              const expired = isExpired(card.expMonth, card.expYear);

              return (
                <button
                  key={card.id}
                  type='button'
                  onClick={() => onCardChange(card.id)}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-xl border text-sm transition-all text-left',
                    selected ? 'border-ob-caramel bg-ob-caramel/5' : 'border-ob-border hover:border-ob-caramel/40',
                    expired && 'opacity-60',
                  )}
                >
                  {/* Left — icon + card info */}
                  <div className='flex items-center gap-2.5'>
                    <span className='text-base leading-none'>{CARD_ICON[card.cardType] ?? '💳'}</span>
                    <div className='flex flex-col gap-0.5'>
                      <div className='flex items-center gap-1.5'>
                        <span className='font-medium text-ob-text'>
                          {card.cardType} •••• {card.last4}
                        </span>

                        {card.isDefault && (
                          <span className='px-1.5 py-0.5 rounded text-[10px] font-semibold bg-ob-caramel/12 text-ob-caramel leading-none'>
                            Default
                          </span>
                        )}

                        {expired && (
                          <span className='px-1.5 py-0.5 rounded text-[10px] font-semibold bg-ob-error/10 text-ob-error leading-none'>Expired</span>
                        )}
                      </div>
                      <span className='text-xs text-ob-muted'>
                        Expires {String(card.expMonth).padStart(2, '0')}/{card.expYear}
                      </span>
                    </div>
                  </div>

                  {/* Right — selection indicator */}
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full border-2 shrink-0 transition-all',
                      selected ? 'border-ob-caramel bg-ob-caramel' : 'border-ob-border',
                    )}
                  />
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
