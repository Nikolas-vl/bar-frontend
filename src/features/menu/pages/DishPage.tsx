import { useState } from 'react';
import { Navigate, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDish } from '../hooks/useDish';
import { useAddToCart } from '../../cart/hooks/useAddToCart';
import { useAuthStore } from '@/app/store/auth.store';
import { useBackNavigation } from '@/shared/hooks/useBackNavigation';
import { DishDetailSkeleton } from '../components/dish/DishDetailSkeleton';
import { DishHeader } from '../components/dish/DishHeader';
import { DishNutrition } from '../components/dish/DishNutrition';
import { DishIngredients } from '../components/dish/DishIngredients';
import { DishExtrasSelector } from '../components/dish/DishExtrasSelector';
import { DishActions } from '../components/dish/DishActions';

export default function DishPage() {
  const { id } = useParams<{ id: string }>();
  const parsedId = Number(id);

  if (Number.isNaN(parsedId) || parsedId <= 0) return <Navigate to='/menu' replace />;

  return <DishDetail id={parsedId} />;
}

function DishDetail({ id }: { id: number }) {
  const location = useLocation();
  const { data: dish, isLoading, error } = useDish(id);
  const [selectedExtras, setSelectedExtras] = useState<Record<number, number>>({});
  const [note, setNote] = useState('');
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const navigate = useNavigate();
  const goBack = useBackNavigation({ fallback: '/menu' });

  if (isLoading) return <DishDetailSkeleton />;
  if (error || !dish) {
    return (
      <div className='page-container py-10 text-center'>
        <p className='text-lg text-ob-muted'>Dish not found.</p>
        <button type='button' onClick={goBack} className='btn-primary mt-6 inline-flex'>
          ← Back to Menu
        </button>
      </div>
    );
  }

  const optionalIngredients = dish.ingredients.filter(i => i.optional);

  const handleChangeExtra = (ingredientId: number, delta: number) => {
    setSelectedExtras(prev => {
      const next = (prev[ingredientId] ?? 0) + delta;
      if (next <= 0) {
        const rest = { ...prev };
        delete rest[ingredientId];
        return rest;
      }
      return { ...prev, [ingredientId]: next };
    });
  };

  const extrasTotal = Object.entries(selectedExtras).reduce((sum, [ingredientId, qty]) => {
    const ingredient = dish.ingredients.find(i => i.ingredientId === Number(ingredientId))?.ingredient;
    return sum + (ingredient ? parseFloat(ingredient.price) * qty : 0);
  }, 0);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    addToCart({
      dishId: dish.id,
      quantity: 1,
      note: note.trim() || undefined,
      extras: Object.entries(selectedExtras).map(([id, qty]) => ({ ingredientId: Number(id), quantity: qty })),
    });
  };

  return (
    <div className='page-container py-10'>
      <button type='button' onClick={goBack} className='inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity text-ob-muted'>
        ← Back to Menu
      </button>
      <div className='max-w-3xl mx-auto'>
        <DishHeader dish={dish} />
        <DishNutrition dish={dish} />
        <DishIngredients ingredients={dish.ingredients} />
        <DishExtrasSelector optionalIngredients={optionalIngredients} selected={selectedExtras} onChange={handleChangeExtra} />
        <DishActions
          displayPrice={parseFloat(dish.price) + extrasTotal}
          note={note}
          isAdding={isAdding}
          isAvailable={dish.isAvailable}
          onNoteChange={setNote}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}
