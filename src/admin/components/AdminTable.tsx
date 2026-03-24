import { type ReactNode, Fragment } from 'react';
import { Skeleton, EmptyState } from '@/shared/ui';
import { cn } from '@/shared/lib/utils/cn';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  rowKey: (row: T) => string | number;
  onRowClick?: (row: T) => void;
  expandedRow?: string | number | null;
  renderExpanded?: (row: T) => ReactNode;
}

export function AdminTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No data found',
  emptyIcon = '📭',
  rowKey,
  onRowClick,
  expandedRow,
  renderExpanded,
}: AdminTableProps<T>) {
  if (isLoading) {
    return (
      <div className='card p-6 space-y-3'>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className='h-10 w-full' />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <EmptyState title={emptyMessage} icon={emptyIcon} layout='inline' className='p-12' />;
  }

  return (
    <div className='overflow-x-auto card p-0'>
      <table className='table-root'>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} className={col.className}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => {
            const key = rowKey(row);
            const isExpanded = expandedRow === key;
            return (
              <Fragment key={key}>
                <tr
                  onClick={() => onRowClick?.(row)}
                  className={cn(onRowClick && 'cursor-pointer hover:bg-ob-blue/30 transition-colors', isExpanded && 'bg-ob-blue/20')}
                >
                  {columns.map(col => (
                    <td key={col.key} className={col.className}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
                {isExpanded && renderExpanded && (
                  <tr>
                    <td colSpan={columns.length} className='p-0'>
                      <div className='bg-ob-bg/50 border-t border-ob-border px-6 py-4'>{renderExpanded(row)}</div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
