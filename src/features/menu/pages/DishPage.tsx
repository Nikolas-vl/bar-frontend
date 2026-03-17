import { Navigate, useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useDish } from '../hooks/useDish';
import { formatPrice } from '../../../utils/cn';
import { CATEGORY_LABEL, CATEGORY_EMOJI } from '../../../constants/category';
import { Skeleton } from '../../../components/shared/ui/Skeleton';
import { NutritionStat } from '../components/NutritionStat';
import { IngredientChip } from '../components/IngredientChip';

export default function DishPage() {
  const { id } = useParams<{ id: string }>();
  const parsedId = Number(id);

  if (Number.isNaN(parsedId) || parsedId <= 0) {
    return <Navigate to='/menu' replace />;
  }

  return <DishDetail id={parsedId} />;
}

function DishDetail({ id }: { id: number }) {
  const { data: dish, isLoading, error } = useDish(id);

  if (isLoading) {
    return (
      <div className='page-container py-10'>
        <div className='max-w-3xl mx-auto flex flex-col gap-6'>
          <Skeleton className='w-full aspect-video rounded-2xl' />
          <Skeleton className='h-8 rounded-lg w-2/3' />
          <Skeleton className='h-4 rounded-lg w-full' />
          <Skeleton className='h-4 rounded-lg w-4/5' />
          <div className='grid grid-cols-4 gap-3'>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className='h-16 rounded-xl' />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !dish) {
    return (
      <div className='page-container py-10 text-center'>
        <p className='text-lg text-ob-muted'>Dish not found.</p>
        <Link to='/menu' className='btn-primary mt-6 inline-flex'>
          ← Back to Menu
        </Link>
      </div>
    );
  }

  const requiredIngredients = dish.ingredients.filter(i => !i.optional);
  const optionalIngredients = dish.ingredients.filter(i => i.optional);

  const handleAddToCart = () => {
    toast.success(`${dish.name} added to cart!`);
  };

  return (
    <div className='page-container py-10'>
      <Link to='/menu' className='inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity text-ob-muted'>
        ← Back to Menu
      </Link>

      <div className='max-w-3xl mx-auto'>
        <div className='w-full aspect-video rounded-2xl overflow-hidden mb-8 bg-ob-surface'>
          {dish.imageUrl ? (
            <img src={dish.imageUrl} alt={dish.name} className='w-full h-full object-cover' />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-7xl'>🍽️</div>
          )}
        </div>

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

        {dish.calories !== null && (
          <div className='card p-5 mb-6'>
            <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ob-muted'>Nutritional Values</h2>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
              <NutritionStat label='Calories' value={dish.calories} unit='kcal' highlight />
              {dish.protein !== null && <NutritionStat label='Protein' value={dish.protein} unit='g' />}
              {dish.fat !== null && <NutritionStat label='Fat' value={dish.fat} unit='g' />}
              {dish.carbs !== null && <NutritionStat label='Carbs' value={dish.carbs} unit='g' />}
            </div>
          </div>
        )}

        {dish.ingredients.length > 0 && (
          <div className='card p-5 mb-8'>
            <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ob-muted'>Ingredients</h2>

            {requiredIngredients.length > 0 && (
              <div className='mb-3'>
                <p className='text-xs font-semibold uppercase tracking-wider mb-2 text-ob-muted'>Included</p>
                <div className='flex flex-wrap gap-2'>
                  {requiredIngredients.map(di => (
                    <IngredientChip key={di.ingredientId} name={di.ingredient.name} quantity={di.quantity} optional={false} />
                  ))}
                </div>
              </div>
            )}

            {optionalIngredients.length > 0 && (
              <div>
                <p className='text-xs font-semibold uppercase tracking-wider mb-2 text-ob-muted'>Optional extras</p>
                <div className='flex flex-wrap gap-2'>
                  {optionalIngredients.map(di => (
                    <IngredientChip key={di.ingredientId} name={di.ingredient.name} quantity={di.quantity} price={di.ingredient.price} optional />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {dish.isAvailable ? (
          <button onClick={handleAddToCart} className='btn-primary w-full justify-center text-base py-3.5'>
            Add to Cart — {formatPrice(dish.price)}
          </button>
        ) : (
          <div className='w-full text-center py-3.5 rounded-xl text-sm font-medium bg-ob-border text-ob-muted'>Currently unavailable</div>
        )}
      </div>
    </div>
  );
}


