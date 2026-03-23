import { AdminTable } from '@/features/admin/components/AdminTable';
import { formatPrice } from '@/utils/cn';
import { IconEdit, IconTrash } from '@/assets/icons';
import type { Ingredient } from '@/types';

interface IngredientTableProps {
  ingredients: Ingredient[];
  isLoading: boolean;
  onEdit: (ingredient: Ingredient) => void;
  onDelete: (id: number) => void;
}

export function IngredientTable({ ingredients, isLoading, onEdit, onDelete }: IngredientTableProps) {
  const columns = [
    { key: 'id', header: '#', render: (i: Ingredient) => <span className='font-mono text-xs text-ob-muted'>{i.id}</span> },
    { key: 'name', header: 'Name', render: (i: Ingredient) => <span className='font-semibold'>{i.name}</span> },
    { key: 'price', header: 'Price', render: (i: Ingredient) => <span className='text-ob-caramel font-mono'>{formatPrice(i.price)}</span> },
    {
      key: 'actions',
      header: '',
      render: (i: Ingredient) => (
        <div className='flex items-center gap-1 justify-end'>
          <button type='button' onClick={() => onEdit(i)} className='btn-icon-ghost' aria-label='Edit ingredient'>
            <IconEdit className='w-4 h-4' />
          </button>
          <button type='button' onClick={() => onDelete(i.id)} className='btn-icon-ghost text-ob-error' aria-label='Delete ingredient'>
            <IconTrash className='w-4 h-4' />
          </button>
        </div>
      ),
      className: 'w-24',
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={ingredients}
      isLoading={isLoading}
      rowKey={i => i.id}
      emptyMessage='No ingredients found'
      emptyIcon='🧂'
    />
  );
}
