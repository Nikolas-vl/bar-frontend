import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AdminModal } from '@/features/admin/components/AdminModal';
import { Select, Spinner } from '@/components/shared/ui';
import type { Dish } from '@/types';

// ── Schema ─────────────────────────────────────────────────────────────────

const optionalNumber = (min = 0) =>
  z.preprocess(val => {
    if (val === '' || val == null) return undefined;
    const num = Number(val);
    return isNaN(num) ? undefined : num;
  }, z.number().min(min).optional());

const dishSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0.01, 'Price must be at least 0.01'),
  imageUrl: z.preprocess(val => (val === '' ? undefined : val), z.string().url('Must be a valid URL').optional()),
  calories: optionalNumber(0),
  protein: optionalNumber(0),
  fat: optionalNumber(0),
  carbs: optionalNumber(0),
  category: z.enum(['BREAKFAST', 'LUNCH']),
  isAvailable: z.boolean(),
});

type DishFormInput = z.input<typeof dishSchema>;
type DishFormOutput = z.output<typeof dishSchema>;

// ── Props ──────────────────────────────────────────────────────────────────

interface DishFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: Dish | null;
  onSubmit: (data: DishFormOutput) => void;
  isPending: boolean;
}

// ── Component ──────────────────────────────────────────────────────────────

const EMPTY_DEFAULTS: DishFormInput = {
  name: '',
  description: '',
  price: '',
  imageUrl: '',
  calories: '',
  protein: '',
  fat: '',
  carbs: '',
  category: 'LUNCH',
  isAvailable: true,
};

const CATEGORY_OPTIONS = [
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'LUNCH', label: 'Lunch' },
];

export function DishFormModal({ isOpen, onClose, dish, onSubmit, isPending }: DishFormModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DishFormInput, unknown, DishFormOutput>({
    resolver: zodResolver(dishSchema),
    defaultValues: EMPTY_DEFAULTS,
  });

  const category = useWatch({
    control,
    name: 'category',
    defaultValue: 'LUNCH',
  });

  // Populate form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (dish) {
      reset({
        name: dish.name,
        description: dish.description ?? undefined,
        price: parseFloat(dish.price),
        imageUrl: dish.imageUrl ?? undefined,
        calories: dish.calories ?? undefined,
        protein: dish.protein ?? undefined,
        fat: dish.fat ?? undefined,
        carbs: dish.carbs ?? undefined,
        category: dish.category,
        isAvailable: dish.isAvailable,
      });
    } else {
      reset(EMPTY_DEFAULTS);
    }
  }, [isOpen, dish, reset]);

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
      <form id='dish-form' onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* Name */}
        <div className='space-y-1.5'>
          <label htmlFor='dish-name' className='label'>
            Name *
          </label>
          <input id='dish-name' type='text' className={errors.name ? 'input input-error' : 'input'} {...register('name')} />
          {errors.name && <p className='field-error'>{errors.name.message}</p>}
        </div>

        {/* Description */}
        <div className='space-y-1.5'>
          <label htmlFor='dish-desc' className='label'>
            Description
          </label>
          <textarea id='dish-desc' className='textarea' rows={3} {...register('description')} />
        </div>

        {/* Price + Category */}
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
              options={CATEGORY_OPTIONS}
            />
          </div>
        </div>

        {/* Image URL */}
        <div className='space-y-1.5'>
          <label htmlFor='dish-img' className='label'>
            Image URL
          </label>
          <input
            id='dish-img'
            type='text'
            placeholder='https://...'
            className={errors.imageUrl ? 'input input-error' : 'input'}
            {...register('imageUrl')}
          />
          {errors.imageUrl && <p className='field-error'>{errors.imageUrl.message}</p>}
        </div>

        {/* Nutrition */}
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

        {/* Availability */}
        <label className='flex items-center gap-2 cursor-pointer'>
          <input type='checkbox' className='accent-ob-caramel w-4 h-4' {...register('isAvailable')} />
          <span className='text-sm text-ob-text'>Available for ordering</span>
        </label>
      </form>
    </AdminModal>
  );
}
