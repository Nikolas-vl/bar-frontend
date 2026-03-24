import { AppImage } from '@/shared/ui';
import { formatPrice } from '@/shared/lib/utils/cn';
import { CATEGORY_LABEL, CATEGORY_EMOJI } from '@/shared/config/category.constants';
import type { Dish } from '@/shared/types';

interface DishHeaderProps {
  dish: Dish;
}

export function DishHeader({ dish }: DishHeaderProps) {
  return (
    <>
      <AppImage src={dish.imageUrl} alt={dish.name} aspectRatio='video' showLabel className='rounded-2xl mb-8' />

      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6'>
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-sm font-medium text-ob-muted'>
              {CATEGORY_EMOJI[dish.category]} {CATEGORY_LABEL[dish.category]}
            </span>
            {!dish.isAvailable && <span className='px-2 py-0.5 rounded-full text-xs font-semibold bg-ob-error/10 text-ob-error'>Unavailable</span>}
          </div>
          <h1 className='font-display text-3xl font-semibold text-ob-text'>{dish.name}</h1>
        </div>
        <span className='font-display text-3xl font-semibold shrink-0 text-ob-caramel'>{formatPrice(dish.price)}</span>
      </div>

      {dish.description && <p className='text-base leading-relaxed mb-8 text-ob-muted'>{dish.description}</p>}
    </>
  );
}
