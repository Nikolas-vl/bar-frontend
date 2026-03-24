import { Spinner } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/utils/cn';

interface DishActionsProps {
  displayPrice: number;
  note: string;
  isAdding: boolean;
  isAvailable: boolean;
  onNoteChange: (note: string) => void;
  onAddToCart: () => void;
}

export function DishActions({ displayPrice, note, isAdding, isAvailable, onNoteChange, onAddToCart }: DishActionsProps) {
  return (
    <>
      <div className='mb-6'>
        <label className='label'>Special instructions (optional)</label>
        <input
          type='text'
          value={note}
          onChange={e => onNoteChange(e.target.value)}
          placeholder='E.g. no onions, extra sauce…'
          maxLength={500}
          className='input w-full'
        />
      </div>

      <button onClick={onAddToCart} disabled={isAdding} className='btn-primary w-full justify-center text-base py-3.5'>
        {isAdding ? (
          <span className='flex items-center gap-2'>
            <Spinner variant='white' />
            Adding…
          </span>
        ) : (
          <>Add to Cart — {formatPrice(displayPrice.toFixed(2))}</>
        )}
      </button>

      {!isAvailable && (
        <p className='mt-3 text-center text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 leading-relaxed'>
          ⚠️ This dish is currently unavailable. You can add it to your cart, but you won't be able to place an order until it becomes available
          again.
        </p>
      )}
    </>
  );
}
