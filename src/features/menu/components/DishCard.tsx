import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { Dish } from '../../../types/index';
import { formatPrice } from '../../../utils/cn';
import { cn } from '../../../utils/cn';
import { CATEGORY_LABEL, CATEGORY_BADGE_CLASS } from '../../../constants/category';

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
        !dish.isAvailable && 'opacity-60',
        className,
      )}
    >
      {/* Image */}
      <div className='relative w-full aspect-4/3 bg-ob-surface overflow-hidden shrink-0'>
        {dish.imageUrl ? (
          <img src={dish.imageUrl} alt={dish.name} className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105' />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-4xl' style={{ color: 'var(--color-ob-border)' }}>
            🍽️
          </div>
        )}

        {/* Category badge */}
        <span className={cn('absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[11px] font-semibold', CATEGORY_BADGE_CLASS[dish.category])}>
          {CATEGORY_LABEL[dish.category]}
        </span>

        {/* Unavailable overlay */}
        {!dish.isAvailable && (
          <div className='absolute inset-0 bg-ob-bg/60 flex items-center justify-center'>
            <span className='text-xs font-semibold uppercase tracking-wider text-ob-muted bg-ob-surface px-3 py-1 rounded-full'>Unavailable</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex flex-col flex-1 p-4 gap-2'>
        <h3 className='font-display font-semibold text-[15px] leading-tight' style={{ color: 'var(--color-ob-text)' }}>
          {dish.name}
        </h3>

        {dish.description && (
          <p className='text-xs leading-relaxed line-clamp-2' style={{ color: 'var(--color-ob-text-muted)' }}>
            {dish.description}
          </p>
        )}

        {/* Macros */}
        {dish.calories !== null && (
          <div className='flex items-center gap-3 mt-auto pt-2'>
            <MacroChip label='kcal' value={dish.calories} />
            {dish.protein !== null && <MacroChip label='P' value={dish.protein} unit='g' />}
            {dish.fat !== null && <MacroChip label='F' value={dish.fat} unit='g' />}
            {dish.carbs !== null && <MacroChip label='C' value={dish.carbs} unit='g' />}
          </div>
        )}

        {/* Price row */}
        <div className='flex items-center justify-between mt-2'>
          <span className='font-display font-semibold text-base' style={{ color: 'var(--color-ob-caramel)' }}>
            {formatPrice(dish.price)}
          </span>
          <span
            className='text-xs font-medium px-2 py-0.5 rounded-full transition-colors'
            style={{
              background: 'rgba(197,139,90,0.08)',
              color: 'var(--color-ob-caramel)',
            }}
          >
            View →
          </span>
        </div>
      </div>
    </Link>
  );
});

function MacroChip({ label, value, unit = '' }: { label: string; value: number; unit?: string }) {
  return (
    <span className='text-[10px] font-medium' style={{ color: 'var(--color-ob-text-muted)' }}>
      <span className='font-semibold' style={{ color: 'var(--color-ob-text)' }}>
        {Math.round(value)}
        {unit}
      </span>{' '}
      {label}
    </span>
  );
}
