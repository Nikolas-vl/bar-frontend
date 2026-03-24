import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Dish } from '@/shared/types';
import { formatPrice, cn } from '@/shared/lib/utils/cn';
import { CATEGORY_LABEL, CATEGORY_BADGE_CLASS } from '@/shared/config/category.constants';
import { AppImage } from '@/shared/ui';

interface DishCardProps {
  dish: Dish;
  className?: string;
}

export const DishCard = memo(function DishCard({ dish, className }: DishCardProps) {
  return (
    <Link
      to={`/menu/${dish.id}`}
      className={cn(
        'group card flex flex-col overflow-hidden transition-all duration-200',
        'hover:shadow-[0_8px_32px_rgba(47,47,47,0.12)] hover:-translate-y-0.5',
        className,
      )}
    >
      <div className='relative shrink-0'>
        <AppImage src={dish.imageUrl} alt={dish.name} aspectRatio='4/3' hoverScale showLabel />

        <span className={cn('absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-semibold', CATEGORY_BADGE_CLASS[dish.category])}>
          {CATEGORY_LABEL[dish.category]}
        </span>

        {!dish.isAvailable && (
          <span className='absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-ob-text/70 text-white'>Unavailable</span>
        )}
      </div>

      <div className='flex flex-col flex-1 p-4 gap-2'>
        <h3 className='font-display font-semibold text-[15px] leading-tight text-ob-text'>{dish.name}</h3>

        {dish.description && <p className='text-xs leading-relaxed line-clamp-2 text-ob-muted'>{dish.description}</p>}

        {dish.calories !== null && (
          <div className='flex items-center gap-3 mt-auto pt-2'>
            <MacroChip label='kcal' value={dish.calories} />
            {dish.protein !== null && <MacroChip label='P' value={dish.protein} unit='g' />}
            {dish.fat !== null && <MacroChip label='F' value={dish.fat} unit='g' />}
            {dish.carbs !== null && <MacroChip label='C' value={dish.carbs} unit='g' />}
          </div>
        )}

        <div className='flex items-center justify-between mt-2'>
          <span className='font-display font-semibold text-base text-ob-caramel'>{formatPrice(dish.price)}</span>
          <span className='text-xs font-medium px-2 py-0.5 rounded-full transition-colors bg-ob-caramel/8 text-ob-caramel'>View →</span>
        </div>
      </div>
    </Link>
  );
});

function MacroChip({ label, value, unit = '' }: { label: string; value: number; unit?: string }) {
  return (
    <span className='text-[10px] font-medium text-ob-muted'>
      <span className='font-semibold text-ob-text'>
        {Math.round(value)}
        {unit}
      </span>{' '}
      {label}
    </span>
  );
}
