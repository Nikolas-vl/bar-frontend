import { useState } from 'react';
import { useAdminTables, useCreateTable, useUpdateTable, useDeleteTable } from '../hooks/useAdminTables';
import { useAdminLocations } from '@/features/admin/locations/hooks/useAdminLocations';
import { TableFormModal } from '../components/TableFormModal';
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { ErrorState } from '@/components/shared/ui';
import { Select } from '@/components/shared/ui';
import { IconPlus, IconEdit, IconTrash } from '@/assets/icons';
import type { Table } from '@/types';

export default function TablesPage() {
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const locationId = locationFilter === 'all' ? undefined : Number(locationFilter);

  const { data: locations } = useAdminLocations();
  const { data: tables, isLoading, error, refetch } = useAdminTables(locationId);

  const createMutation = useCreateTable();
  const updateMutation = useUpdateTable();
  const deleteMutation = useDeleteTable();

  const [editTarget, setEditTarget] = useState<Table | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    ...(locations ?? []).map(l => ({ value: String(l.id), label: l.name })),
  ];

  const columns = [
    { key: 'id', header: '#', render: (t: Table) => <span className='font-mono text-xs text-ob-muted'>{t.id}</span> },
    { key: 'number', header: 'Table Number', render: (t: Table) => <span className='font-semibold'>#{t.number}</span> },
    { key: 'capacity', header: 'Capacity', render: (t: Table) => <span>{t.capacity} seats</span> },
    { key: 'location', header: 'Location', render: (t: Table) => <span className='text-ob-muted'>{t.location?.name ?? '—'}</span> },
    {
      key: 'actions',
      header: '',
      render: (t: Table) => (
        <div className='flex items-center gap-1 justify-end'>
          <button type='button' onClick={e => { e.stopPropagation(); setEditTarget(t); }} className='btn-icon-ghost' aria-label='Edit table'>
            <IconEdit className='w-4 h-4' />
          </button>
          <button type='button' onClick={e => { e.stopPropagation(); setDeleteTarget(t.id); }} className='btn-icon-ghost text-ob-error' aria-label='Delete table'>
            <IconTrash className='w-4 h-4' />
          </button>
        </div>
      ),
      className: 'w-24',
    },
  ];

  if (error) {
    return <ErrorState title='Failed to load tables' onRetry={refetch} />;
  }

  return (
    <div className='page-container py-12 space-y-8'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <h1 className='section-title'>Tables</h1>
        <button type='button' className='btn-primary inline-flex items-center gap-2' onClick={() => setIsCreateOpen(true)}>
          <IconPlus className='w-4 h-4' />
          Add Table
        </button>
      </div>

      {/* Filter */}
      <div className='max-w-xs'>
        <Select value={locationFilter} onChange={setLocationFilter} options={locationOptions} placeholder='Filter by location' />
      </div>

      <AdminTable
        columns={columns}
        data={tables ?? []}
        isLoading={isLoading}
        rowKey={t => t.id}
        emptyMessage='No tables found'
        emptyIcon='🪑'
      />

      {/* Create / Edit Modal */}
      <TableFormModal
        isOpen={!!editTarget || isCreateOpen}
        onClose={() => { setEditTarget(null); setIsCreateOpen(false); }}
        table={editTarget}
        locations={locations ?? []}
        isPending={createMutation.isPending || updateMutation.isPending}
        onSubmit={data => {
          if (editTarget) {
            updateMutation.mutate({ id: editTarget.id, body: data }, { onSuccess: () => setEditTarget(null) });
          } else {
            createMutation.mutate(data, { onSuccess: () => setIsCreateOpen(false) });
          }
        }}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title='Delete table'
        message='This action cannot be undone. Tables with existing reservations cannot be deleted.'
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget!, { onSettled: () => setDeleteTarget(null) })}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
