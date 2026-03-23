import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { AdminModal } from '@/features/admin/components/AdminModal';
import { Spinner } from '@/components/shared/ui';
import type { Ingredient } from '@/types';

const ingredientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.coerce.number().min(0, 'Price must be 0 or above'),
});

type IngredientFormData = z.infer<typeof ingredientSchema>;

interface IngredientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
  onSubmit: (data: IngredientFormData) => void;
  isPending: boolean;
}

export function IngredientFormModal({ isOpen, onClose, ingredient, onSubmit, isPending }: IngredientFormModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<IngredientFormData>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: { name: '', price: 0 },
  });

  useEffect(() => {
    if (isOpen) {
      if (ingredient) {
        reset({ name: ingredient.name, price: parseFloat(ingredient.price) });
      } else {
        reset({ name: '', price: 0 });
      }
    }
  }, [isOpen, ingredient, reset]);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={ingredient ? 'Edit Ingredient' : 'New Ingredient'}
      size='sm'
      footer={
        <>
          <button type='button' className='btn-ghost' onClick={onClose} disabled={isPending}>Cancel</button>
          <button type='submit' form='ingredient-form' className='btn-primary inline-flex items-center gap-2' disabled={isPending}>
            {isPending && <Spinner variant='white' size='sm' />}
            {ingredient ? 'Save' : 'Create'}
          </button>
        </>
      }
    >
      <form id='ingredient-form' onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-1.5'>
          <label htmlFor='ing-name' className='label'>Name</label>
          <input id='ing-name' type='text' className={errors.name ? 'input input-error' : 'input'} {...register('name')} />
          {errors.name && <p className='field-error'>{errors.name.message}</p>}
        </div>
        <div className='space-y-1.5'>
          <label htmlFor='ing-price' className='label'>Price (PLN)</label>
          <input id='ing-price' type='number' step='0.01' min='0' className={errors.price ? 'input input-error' : 'input'} {...register('price')} />
          {errors.price && <p className='field-error'>{errors.price.message}</p>}
        </div>
      </form>
    </AdminModal>
  );
}
