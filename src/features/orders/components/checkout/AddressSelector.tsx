import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils/cn';
import type { Address } from '@/shared/types';

interface AddressSelectorProps {
  addresses: Address[];
  selectedId: number | null;
  onChange: (id: number) => void;
}

export function AddressSelector({ addresses, selectedId, onChange }: AddressSelectorProps) {
  if (addresses.length === 0) {
    return (
      <div className='rounded-xl bg-ob-bg border border-ob-border p-4 flex items-center justify-between gap-3'>
        <p className='text-xs text-ob-muted'>No saved addresses. Add one in your profile to use delivery.</p>
        <Link to='/profile/addresses' className='text-xs font-semibold text-ob-caramel hover:underline shrink-0'>
          Add address →
        </Link>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      {addresses.map(addr => {
        const selected = selectedId === addr.id;

        return (
          <button
            key={addr.id}
            type='button'
            onClick={() => onChange(addr.id)}
            className={cn(
              'flex items-center justify-between p-3 rounded-xl border text-sm transition-all text-left',
              selected ? 'border-ob-caramel bg-ob-caramel/5' : 'border-ob-border hover:border-ob-caramel/40',
            )}
          >
            <div className='flex items-start gap-2.5'>
              <span className='text-base leading-none mt-0.5'>📍</span>
              <div className='flex flex-col gap-0.5'>
                <div className='flex items-center gap-1.5 flex-wrap'>
                  <span className='font-medium text-ob-text'>{addr.street}</span>
                  {addr.isDefault && (
                    <span className='px-1.5 py-0.5 rounded text-[10px] font-semibold bg-ob-caramel/12 text-ob-caramel leading-none'>Default</span>
                  )}
                </div>
                <span className='text-xs text-ob-muted'>
                  {addr.zip} {addr.city}
                </span>
              </div>
            </div>

            <div
              className={cn(
                'w-4 h-4 rounded-full border-2 shrink-0 transition-all',
                selected ? 'border-ob-caramel bg-ob-caramel' : 'border-ob-border',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
