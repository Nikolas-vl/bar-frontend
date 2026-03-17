import { cn, formatPrice } from '@/utils/cn';

interface IngredientChipProps {
  name: string;
  quantity: number;
  price?: string;
  optional: boolean;
}

export function IngredientChip({ name, quantity, price, optional }: IngredientChipProps) {
  return (
    <span
      className={cn(
        'flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border',
        optional ? 'bg-ob-caramel/8 text-ob-caramel border-dashed border-ob-caramel/30' : 'bg-ob-surface border-ob-border text-ob-text',
      )}
    >
      {quantity > 1 && <span className='font-bold'>×{quantity}</span>}
      {name}
      {optional && price && <span className='opacity-70'>+{formatPrice(price)}</span>}
    </span>
  );
}
