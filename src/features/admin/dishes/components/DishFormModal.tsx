import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { AdminModal } from '@/features/admin/components/AdminModal';
import { Spinner } from '@/components/shared/ui';
import { Select } from '@/components/shared/ui';
import type { Dish } from '@/types';

const dishSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price must be above 0'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  calories: z.coerce.number().int().min(0).optional().or(z.literal('')),
  protein: z.coerce.number().min(0).optional().or(z.literal('')),
  fat: z.coerce.number().min(0).optional().or(z.literal('')),
  carbs: z.coerce.number().min(0).optional().or(z.literal('')),
  category: z.enum(['BREAKFAST', 'LUNCH']),
  isAvailable: z.boolean(),
});

type DishFormData = z.infer<typeof dishSchema>;

interface DishFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  onSubmit: (data: DishFormData) => void;
  isPending: boolean;
}

export function DishFormModal({ isOpen, onClose, dish, onSubmit, isPending }: DishFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DishFormData>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      calories: '',
      protein: '',
      fat: '',
      carbs: '',
      category: 'LUNCH',
      isAvailable: true,
    },
  });

  const category = watch('category');

  useEffect(() => {
    if (isOpen) {
      if (dish) {
        reset({
          name: dish.name,
          description: dish.description ?? '',
          price: parseFloat(dish.price),
          imageUrl: dish.imageUrl ?? '',
          calories: dish.calories ?? '',
          protein: dish.protein ?? '',
          fat: dish.fat ?? '',
          carbs: dish.carbs ?? '',
          category: dish.category,
          isAvailable: dish.isAvailable,
        });
      } else {
        reset({
          name: '',
          description: '',
          price: 0,
          imageUrl: '',
          calories: '',
          protein: '',
          fat: '',
          carbs: '',
          category: 'LUNCH',
          isAvailable: true,
        });
      }
    }
  }, [isOpen, dish, reset]);

  const handleFormSubmit = (data: DishFormData) => {
    const cleaned = {
      ...data,
      imageUrl: data.imageUrl || undefined,
      description: data.description || undefined,
      calories: data.calories === '' ? undefined : Number(data.calories),
      protein: data.protein === '' ? undefined : Number(data.protein),
      fat: data.fat === '' ? undefined : Number(data.fat),
      carbs: data.carbs === '' ? undefined : Number(data.carbs),
    };
    onSubmit(cleaned as DishFormData);
  };

  const categoryOptions = [
    { value: 'BREAKFAST', label: 'Breakfast' },
    { value: 'LUNCH', label: 'Lunch' },
  ];

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={dish ? 'Edit Dish' : 'New Dish'}
      size='lg'
      footer={
        <>
          <button type='button' className='btn-ghost' onClick={onClose} disabled={isPending}>
            Cancel
          </button>
          <button type='submit' form='dish-form' className='btn-primary inline-flex items-center gap-2' disabled={isPending}>
            {isPending && <Spinner variant='white' size='sm' />}
            {dish ? 'Save Changes' : 'Create Dish'}
          </button>
        </>
      }
    >
      <form id='dish-form' onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
        <div className='space-y-1.5'>
          <label htmlFor='dish-name' className='label'>
            Name *
          </label>
          <input id='dish-name' type='text' className={errors.name ? 'input input-error' : 'input'} {...register('name')} />
          {errors.name && <p className='field-error'>{errors.name.message}</p>}
        </div>

        <div className='space-y-1.5'>
          <label htmlFor='dish-desc' className='label'>
            Description
          </label>
          <textarea id='dish-desc' className='textarea' rows={3} {...register('description')} />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='space-y-1.5'>
            <label htmlFor='dish-price' className='label'>
              Price (PLN) *
            </label>
            <input
              id='dish-price'
              type='number'
              step='0.01'
              min='0.01'
              className={errors.price ? 'input input-error' : 'input'}
              {...register('price')}
            />
            {errors.price && <p className='field-error'>{errors.price.message}</p>}
          </div>
          <div className='space-y-1.5'>
            <label className='label'>Category</label>
            <Select
              value={category}
              onChange={v => setValue('category', v as 'BREAKFAST' | 'LUNCH', { shouldValidate: true })}
              options={categoryOptions}
            />
          </div>
        </div>

        <div className='space-y-1.5'>
          <label htmlFor='dish-img' className='label'>
            Image URL
          </label>
          <input
            id='dish-img'
            type='text'
            className={errors.imageUrl ? 'input input-error' : 'input'}
            placeholder='https://...'
            {...register('imageUrl')}
          />
          {errors.imageUrl && <p className='field-error'>{errors.imageUrl.message}</p>}
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
          <div className='space-y-1.5'>
            <label htmlFor='dish-cal' className='label'>
              Calories
            </label>
            <input id='dish-cal' type='number' min='0' className='input' {...register('calories')} />
          </div>
          <div className='space-y-1.5'>
            <label htmlFor='dish-prot' className='label'>
              Protein (g)
            </label>
            <input id='dish-prot' type='number' min='0' step='0.1' className='input' {...register('protein')} />
          </div>
          <div className='space-y-1.5'>
            <label htmlFor='dish-fat' className='label'>
              Fat (g)
            </label>
            <input id='dish-fat' type='number' min='0' step='0.1' className='input' {...register('fat')} />
          </div>
          <div className='space-y-1.5'>
            <label htmlFor='dish-carbs' className='label'>
              Carbs (g)
            </label>
            <input id='dish-carbs' type='number' min='0' step='0.1' className='input' {...register('carbs')} />
          </div>
        </div>

        <label className='flex items-center gap-2 cursor-pointer'>
          <input type='checkbox' {...register('isAvailable')} className='accent-ob-caramel w-4 h-4' />
          <span className='text-sm text-ob-text'>Available for ordering</span>
        </label>
      </form>
    </AdminModal>
  );
}
