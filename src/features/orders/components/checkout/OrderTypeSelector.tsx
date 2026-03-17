import { cn } from '@/utils/cn';
import type { OrderType } from '@/types';

const OPTIONS: { value: OrderType; label: string; icon: string; description: string }[] = [
  { value: 'DINE_IN', label: 'Dine In', icon: '🍽️', description: 'Eat at the restaurant' },
  { value: 'TAKE_OUT', label: 'Take Out', icon: '🥡', description: 'Pick up your order' },
  { value: 'DELIVERY', label: 'Delivery', icon: '🛵', description: 'Delivered to your door' },
];

interface OrderTypeSelectorProps {
  value: OrderType;
  onChange: (type: OrderType) => void;
}

export function OrderTypeSelector({ value, onChange }: OrderTypeSelectorProps) {
  return (
    <div className='grid grid-cols-3 gap-3'>
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          type='button'
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center',
            value === opt.value ? 'border-ob-caramel bg-ob-caramel/5' : 'border-ob-border bg-ob-surface hover:border-ob-caramel/40',
          )}
        >
          <span className='text-2xl'>{opt.icon}</span>
          <span className='text-xs font-semibold text-ob-text'>{opt.label}</span>
          <span className='text-[10px] text-ob-muted leading-tight'>{opt.description}</span>
        </button>
      ))}
    </div>
  );
}
