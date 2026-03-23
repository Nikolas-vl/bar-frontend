import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminModal } from '@/features/admin/components/AdminModal';
import { Spinner } from '@/components/shared/ui';
import type { Ingredient } from '@/types';
import { ingredientSchema, type IngredientFormInput, type IngredientFormOutput } from '../schemas/ingredient.schema';
import { mapIngredientToForm, mapIngredientFormToDto } from '../mappers/ingredient.mapper';
import type { CreateIngredientDto } from '../dto/ingredient.dto';

interface IngredientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredient: Ingredient | null;
  onSubmit: (data: CreateIngredientDto) => void;
  isPending: boolean;
}

export function IngredientFormModal({ isOpen, onClose, ingredient, onSubmit, isPending }: IngredientFormModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<IngredientFormInput, unknown, IngredientFormOutput>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: { name: '', price: 0 },
  });

  useEffect(() => {
    if (isOpen) {
      if (ingredient) {
        reset(mapIngredientToForm(ingredient));
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
      <form id='ingredient-form' onSubmit={handleSubmit((data) => onSubmit(mapIngredientFormToDto(data)))} className='space-y-4'>
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
