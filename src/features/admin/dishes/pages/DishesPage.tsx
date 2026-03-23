import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdminDishes, useCreateDish, useUpdateDish, useDeleteDish, useToggleDishAvailability } from '../hooks/useAdminDishes';
import { useAdminIngredients, useCreateIngredient, useUpdateIngredient, useDeleteIngredient } from '../hooks/useAdminIngredients';
import { DishAdminCard } from '../components/DishAdminCard';
import { DishFormModal } from '../components/DishFormModal';
import { IngredientTable } from '../components/IngredientTable';
import { IngredientFormModal } from '../components/IngredientFormModal';
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog';
import { SearchInput } from '@/features/admin/components/SearchInput';
import { Skeleton } from '@/components/shared/ui';
import { IconPlus } from '@/assets/icons';
import { cn } from '@/utils/cn';
import type { Category, Dish, Ingredient } from '@/types';
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch';

type Tab = 'dishes' | 'ingredients';

const CATEGORIES: { value: Category | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'LUNCH', label: 'Lunch' },
];

export default function DishesPage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('dishes');

  // ── Dishes state ──────────────────────────────
  const [searchInput, setSearchInput, debouncedSearch] = useDebouncedSearch();
  const [categoryFilter, setCategoryFilter] = useState<Category | 'ALL'>('ALL');

  const dishFilters = {
    search: debouncedSearch || undefined,
    category: categoryFilter === 'ALL' ? undefined : categoryFilter,
  };
  const { data: dishes, isLoading: dishesLoading, error: dishesError, refetch: refetchDishes } = useAdminDishes(dishFilters);
  const createDishMutation = useCreateDish();
  const updateDishMutation = useUpdateDish();
  const deleteDishMutation = useDeleteDish();
  const toggleMutation = useToggleDishAvailability();

  const [editDish, setEditDish] = useState<Dish | null>(null);
  const [deleteDishTarget, setDeleteDishTarget] = useState<number | null>(null);

  // Open create modal from URL param (?action=new)
  const [isCreateDishOpen, setIsCreateDishOpen] = useState(() => searchParams.get('action') === 'new');

  // ── Ingredients state ─────────────────────────
  const [ingSearch, setIngSearch, debouncedIngSearch] = useDebouncedSearch();
  const { data: ingredients, isLoading: ingLoading } = useAdminIngredients({ search: debouncedIngSearch || undefined });
  const createIngMutation = useCreateIngredient();
  const updateIngMutation = useUpdateIngredient();
  const deleteIngMutation = useDeleteIngredient();

  const [editIngredient, setEditIngredient] = useState<Ingredient | null>(null);
  const [isCreateIngOpen, setIsCreateIngOpen] = useState(false);
  const [deleteIngTarget, setDeleteIngTarget] = useState<number | null>(null);

  return (
    <div className='page-container py-12 space-y-8'>
      <h1 className='section-title'>Menu Management</h1>

      {/* Tabs */}
      <div className='flex gap-1 border-b border-ob-border'>
        {(['dishes', 'ingredients'] as Tab[]).map(tab => (
          <button
            key={tab}
            type='button'
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px',
              activeTab === tab ? 'border-ob-caramel text-ob-caramel' : 'border-transparent text-ob-muted hover:text-ob-text',
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ════════════ DISHES TAB ════════════ */}
      {activeTab === 'dishes' && (
        <>
          {/* Toolbar */}
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <div className='flex flex-wrap items-center gap-3'>
              <SearchInput value={searchInput} onChange={setSearchInput} placeholder='Search dishes…' className='w-64' />
              <div className='flex gap-1'>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type='button'
                    onClick={() => setCategoryFilter(cat.value)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
                      categoryFilter === cat.value ? 'bg-ob-caramel text-white' : 'bg-ob-blue text-ob-text hover:bg-ob-border',
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <button type='button' className='btn-primary inline-flex items-center gap-2' onClick={() => setIsCreateDishOpen(true)}>
              <IconPlus className='w-4 h-4' /> Add Dish
            </button>
          </div>

          {/* Content */}
          {dishesError ? (
            <div className='card p-8 text-center space-y-4'>
              <p className='text-ob-error'>Failed to load dishes</p>
              <button type='button' className='btn-primary' onClick={() => refetchDishes()}>
                Retry
              </button>
            </div>
          ) : dishesLoading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className='h-80 w-full rounded-2xl' />
              ))}
            </div>
          ) : dishes && dishes.length === 0 ? (
            <div className='card p-12 flex flex-col items-center gap-3'>
              <span className='text-4xl'>🍽️</span>
              <p className='text-ob-muted text-sm'>No dishes found</p>
              <button type='button' className='btn-secondary' onClick={() => setIsCreateDishOpen(true)}>
                Create your first dish
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {dishes?.map(dish => (
                <DishAdminCard
                  key={dish.id}
                  dish={dish}
                  onEdit={() => setEditDish(dish)}
                  onDelete={() => setDeleteDishTarget(dish.id)}
                  onToggleAvailability={isAvailable => toggleMutation.mutate({ id: dish.id, isAvailable })}
                />
              ))}
            </div>
          )}

          {/* Dish modals */}
          <DishFormModal
            isOpen={!!editDish || isCreateDishOpen}
            onClose={() => {
              setEditDish(null);
              setIsCreateDishOpen(false);
            }}
            dish={editDish}
            isPending={createDishMutation.isPending || updateDishMutation.isPending}
            onSubmit={data => {
              if (editDish) {
                updateDishMutation.mutate({ id: editDish.id, body: data }, { onSuccess: () => setEditDish(null) });
              } else {
                createDishMutation.mutate(data, { onSuccess: () => setIsCreateDishOpen(false) });
              }
            }}
          />
          <ConfirmDialog
            isOpen={deleteDishTarget !== null}
            title='Delete dish'
            message='This will permanently remove this dish from the menu.'
            isPending={deleteDishMutation.isPending}
            onConfirm={() => deleteDishMutation.mutate(deleteDishTarget!, { onSettled: () => setDeleteDishTarget(null) })}
            onCancel={() => setDeleteDishTarget(null)}
          />
        </>
      )}

      {/* ════════════ INGREDIENTS TAB ════════════ */}
      {activeTab === 'ingredients' && (
        <>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <SearchInput value={ingSearch} onChange={setIngSearch} placeholder='Search ingredients…' className='w-64' />
            <button type='button' className='btn-primary inline-flex items-center gap-2' onClick={() => setIsCreateIngOpen(true)}>
              <IconPlus className='w-4 h-4' /> Add Ingredient
            </button>
          </div>

          <IngredientTable ingredients={ingredients ?? []} isLoading={ingLoading} onEdit={setEditIngredient} onDelete={setDeleteIngTarget} />

          <IngredientFormModal
            isOpen={!!editIngredient || isCreateIngOpen}
            onClose={() => {
              setEditIngredient(null);
              setIsCreateIngOpen(false);
            }}
            ingredient={editIngredient}
            isPending={createIngMutation.isPending || updateIngMutation.isPending}
            onSubmit={data => {
              if (editIngredient) {
                updateIngMutation.mutate({ id: editIngredient.id, body: data }, { onSuccess: () => setEditIngredient(null) });
              } else {
                createIngMutation.mutate(data, { onSuccess: () => setIsCreateIngOpen(false) });
              }
            }}
          />
          <ConfirmDialog
            isOpen={deleteIngTarget !== null}
            title='Delete ingredient'
            message='If this ingredient is used in dishes, it may fail.'
            isPending={deleteIngMutation.isPending}
            onConfirm={() => deleteIngMutation.mutate(deleteIngTarget!, { onSettled: () => setDeleteIngTarget(null) })}
            onCancel={() => setDeleteIngTarget(null)}
          />
        </>
      )}
    </div>
  );
}
