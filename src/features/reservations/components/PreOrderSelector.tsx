import { useState } from 'react';
import { Select } from '@/shared/ui/Select';
import { formatPrice } from '@/shared/lib/utils/cn';
import type { Dish } from '@/shared/types';

export interface PreOrderEntry {
  dishId: number;
  quantity: number;
  dish: Dish;
}

interface PreOrderSelectorProps {
  dishes: Dish[];
  entries: PreOrderEntry[];
  onChange: (entries: PreOrderEntry[]) => void;
}

export function PreOrderSelector({ dishes, entries, onChange }: PreOrderSelectorProps) {
  const [selectedDishId, setSelectedDishId] = useState('');

  const available = dishes.filter(d => d.isAvailable && !entries.find(e => e.dishId === d.id));

  const options = available.map(d => ({
    value: String(d.id),
    label: `${d.name} — ${formatPrice(d.price)}`,
  }));

  const addDish = () => {
    if (!selectedDishId) return;
    const dish = dishes.find(d => d.id === Number(selectedDishId));
    if (!dish) return;
    onChange([...entries, { dishId: dish.id, quantity: 1, dish }]);
    setSelectedDishId('');
  };

  const updateQty = (dishId: number, delta: number) => {
    onChange(entries.map(e => (e.dishId === dishId ? { ...e, quantity: e.quantity + delta } : e)).filter(e => e.quantity > 0));
  };

  const remove = (dishId: number) => {
    onChange(entries.filter(e => e.dishId !== dishId));
  };

  return (
    <div className='flex flex-col gap-3'>
      {/* Radix-powered select — fully themed, no OS chrome */}
      <div className='flex gap-2'>
        <div className='flex-1'>
          <Select value={selectedDishId} onChange={setSelectedDishId} options={options} placeholder='Select a dish to pre-order…' />
        </div>
        <button type='button' onClick={addDish} disabled={!selectedDishId} className='btn-secondary px-4 shrink-0 disabled:opacity-40'>
          Add
        </button>
      </div>

      {entries.length > 0 && (
        <div className='card-blue rounded-xl p-3 flex flex-col gap-3'>
          {entries.map(entry => (
            <div key={entry.dishId} className='flex items-center gap-3'>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium text-ob-text truncate'>{entry.dish.name}</p>
                <p className='text-xs text-ob-muted'>{formatPrice((parseFloat(entry.dish.price) * entry.quantity).toFixed(2))}</p>
              </div>

              <div className='flex items-center gap-2 shrink-0'>
                <div className='qty-stepper'>
                  <button type='button' className='qty-btn' onClick={() => updateQty(entry.dishId, -1)}>
                    -
                  </button>
                  <span className='qty-value'>{entry.quantity}</span>
                  <button type='button' className='qty-btn' onClick={() => updateQty(entry.dishId, 1)}>
                    +
                  </button>
                </div>
                <button
                  type='button'
                  onClick={() => remove(entry.dishId)}
                  className='w-7 h-7 flex items-center justify-center rounded-lg text-ob-error hover:bg-ob-error/10 transition-colors text-base font-semibold'
                  aria-label={`Remove ${entry.dish.name}`}
                >
                  x
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
