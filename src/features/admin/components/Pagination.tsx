import { IconChevronLeft, IconChevronRight } from '@/assets/icons';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className='flex items-center justify-center gap-4 py-4'>
      <button
        type='button'
        className='btn-ghost inline-flex items-center gap-1 text-sm'
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label='Previous page'
      >
        <IconChevronLeft className='w-4 h-4' />
        Previous
      </button>

      <span className='text-sm text-ob-muted font-mono'>
        Page {page} of {totalPages}
      </span>

      <button
        type='button'
        className='btn-ghost inline-flex items-center gap-1 text-sm'
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label='Next page'
      >
        Next
        <IconChevronRight className='w-4 h-4' />
      </button>
    </div>
  );
}
