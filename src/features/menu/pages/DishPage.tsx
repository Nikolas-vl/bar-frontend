import { useParams, Link } from 'react-router-dom';
import { useDish } from '../hooks/useDish';
import { formatPrice } from '../../../utils/cn';

const categoryLabel: Record<string, string> = {
  BREAKFAST: '🌅 Breakfast',
  LUNCH: '☀️ Lunch',
};

export default function DishPage() {
  const { id } = useParams<{ id: string }>();
  const { data: dish, isLoading, error } = useDish(Number(id));

  if (isLoading) {
    return (
      <div className='page-container py-10'>
        <div className='max-w-3xl mx-auto animate-pulse flex flex-col gap-6'>
          <div className='w-full aspect-video rounded-2xl' style={{ background: 'var(--color-ob-border)' }} />
          <div className='h-8 rounded-lg w-2/3' style={{ background: 'var(--color-ob-border)' }} />
          <div className='h-4 rounded-lg w-full' style={{ background: 'var(--color-ob-border)' }} />
          <div className='h-4 rounded-lg w-4/5' style={{ background: 'var(--color-ob-border)' }} />
        </div>
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className='page-container py-10 text-center'>
        <p className='text-lg' style={{ color: 'var(--color-ob-text-muted)' }}>
          Dish not found.
        </p>
        <Link to='/menu' className='btn-primary mt-6 inline-flex'>
          ← Back to Menu
        </Link>
      </div>
    );
  }

  const requiredIngredients = dish.ingredients.filter(i => !i.optional);
  const optionalIngredients = dish.ingredients.filter(i => i.optional);

  return (
    <div className='page-container py-10'>
      <Link
        to='/menu'
        className='inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity'
        style={{ color: 'var(--color-ob-text-muted)' }}
      >
        ← Back to Menu
      </Link>

      <div className='max-w-3xl mx-auto'>
        {/* Image */}
        <div className='w-full aspect-video rounded-2xl overflow-hidden mb-8' style={{ background: 'var(--color-ob-surface)' }}>
          {dish.imageUrl ? (
            <img src={dish.imageUrl} alt={dish.name} className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-7xl'>🍽️</div>
          )}
        </div>

        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <span className='text-sm font-medium' style={{ color: 'var(--color-ob-text-muted)' }}>
                {categoryLabel[dish.category]}
              </span>
              {!dish.isAvailable && (
                <span className='px-2 py-0.5 rounded-full text-xs font-semibold bg-[rgba(192,57,43,0.10)] text-[var(--color-ob-error)]'>
                  Unavailable
                </span>
              )}
            </div>
            <h1 className='font-display text-3xl font-semibold' style={{ color: 'var(--color-ob-text)' }}>
              {dish.name}
            </h1>
          </div>
          <span className='font-display text-3xl font-semibold shrink-0' style={{ color: 'var(--color-ob-caramel)' }}>
            {formatPrice(dish.price)}
          </span>
        </div>

        {dish.description && (
          <p className='text-base leading-relaxed mb-8' style={{ color: 'var(--color-ob-text-muted)' }}>
            {dish.description}
          </p>
        )}

        {/* Nutritional values */}
        {dish.calories !== null && (
          <div className='card p-5 mb-6'>
            <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4' style={{ color: 'var(--color-ob-text-muted)' }}>
              Nutritional Values
            </h2>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              {dish.calories !== null && <NutritionStat label='Calories' value={dish.calories} unit='kcal' highlight />}
              {dish.protein !== null && <NutritionStat label='Protein' value={dish.protein} unit='g' />}
              {dish.fat !== null && <NutritionStat label='Fat' value={dish.fat} unit='g' />}
              {dish.carbs !== null && <NutritionStat label='Carbs' value={dish.carbs} unit='g' />}
            </div>
          </div>
        )}

        {/* Ingredients */}
        {dish.ingredients.length > 0 && (
          <div className='card p-5 mb-8'>
            <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4' style={{ color: 'var(--color-ob-text-muted)' }}>
              Ingredients
            </h2>

            {requiredIngredients.length > 0 && (
              <div className='mb-3'>
                <p className='text-xs font-semibold uppercase tracking-wider mb-2' style={{ color: 'var(--color-ob-text-muted)' }}>
                  Included
                </p>
                <div className='flex flex-wrap gap-2'>
                  {requiredIngredients.map(di => (
                    <IngredientChip key={di.ingredientId} name={di.ingredient.name} quantity={di.quantity} optional={false} />
                  ))}
                </div>
              </div>
            )}

            {optionalIngredients.length > 0 && (
              <div>
                <p className='text-xs font-semibold uppercase tracking-wider mb-2' style={{ color: 'var(--color-ob-text-muted)' }}>
                  Optional extras
                </p>
                <div className='flex flex-wrap gap-2'>
                  {optionalIngredients.map(di => (
                    <IngredientChip key={di.ingredientId} name={di.ingredient.name} quantity={di.quantity} price={di.ingredient.price} optional />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add to cart CTA */}
        {dish.isAvailable && <button className='btn-primary w-full justify-center text-base py-3.5'>Add to Cart — {formatPrice(dish.price)}</button>}
      </div>
    </div>
  );
}

function NutritionStat({ label, value, unit, highlight }: { label: string; value: number; unit: string; highlight?: boolean }) {
  return (
    <div className='flex flex-col items-center gap-0.5 p-3 rounded-xl text-center' style={{ background: 'var(--color-ob-bg)' }}>
      <span className='font-display font-bold text-xl' style={{ color: highlight ? 'var(--color-ob-caramel)' : 'var(--color-ob-text)' }}>
        {Math.round(value)}
        <span className='text-sm font-normal ml-0.5'>{unit}</span>
      </span>
      <span className='text-xs' style={{ color: 'var(--color-ob-text-muted)' }}>
        {label}
      </span>
    </div>
  );
}

function IngredientChip({ name, quantity, price, optional }: { name: string; quantity: number; price?: string; optional: boolean }) {
  return (
    <span
      className='flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium'
      style={
        optional
          ? { background: 'rgba(197,139,90,0.08)', color: 'var(--color-ob-caramel)', border: '1px dashed rgba(197,139,90,0.3)' }
          : { background: 'var(--color-ob-surface)', border: '1px solid var(--color-ob-border)', color: 'var(--color-ob-text)' }
      }
    >
      {quantity > 1 && <span className='font-bold'>×{quantity}</span>}
      {name}
      {optional && price && <span className='opacity-70'>+{formatPrice(price)}</span>}
    </span>
  );
}
