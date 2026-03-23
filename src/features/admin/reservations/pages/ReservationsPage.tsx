import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilteredPage } from '../../hooks/useFilteredPage';
import { useAdminReservations, useAdminCreateReservation, useAdminUpdateReservation, useAdminDeleteReservation } from '../hooks/useAdminReservations';
import { useAdminLocations } from '@/features/admin/locations/hooks/useAdminLocations';
import { AdminReservationModal } from '../components/AdminReservationModal';
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { Pagination } from '@/features/admin/components/Pagination';
import { Select } from '@/components/shared/ui';
import { ReservationStatusBadge } from '@/features/reservations/components/ReservationStatusBadge';
import { IconPlus, IconEdit, IconTrash } from '@/assets/icons';
import { formatDate, cn } from '@/utils/cn';
import { getErrorMessage } from '@/api/client';
import type { Reservation } from '@/types';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELED'] as const;
const LIMIT = 20;

export default function AdminReservationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, page, setPage, updateFilter } = useFilteredPage({
    status: 'ALL' as string,
    date: '',
    location: '',
  });

  const { data: locations } = useAdminLocations();

  const params = {
    page,
    limit: LIMIT,
    status: filters.status === 'ALL' ? undefined : filters.status,
    date: filters.date || undefined,
  };

  const { data, isLoading, error, refetch } = useAdminReservations(params);

  const createMutation = useAdminCreateReservation();
  const updateMutation = useAdminUpdateReservation();
  const deleteMutation = useAdminDeleteReservation();

  const [editTarget, setEditTarget] = useState<Reservation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(() => searchParams.get('action') === 'new');

  if (searchParams.get('action') === 'new') {
    const cleaned = new URLSearchParams(searchParams);
    cleaned.delete('action');
    setSearchParams(cleaned, { replace: true });
  }
  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  const filteredData =
    data?.reservations?.filter(r => {
      if (!filters.location) return true;
      return r.table?.locationId === Number(filters.location);
    }) ?? [];

  const locationOptions = [{ value: '', label: 'All Locations' }, ...(locations ?? []).map(l => ({ value: String(l.id), label: l.name }))];

  const columns = [
    { key: 'id', header: '#', render: (r: Reservation) => <span className='font-mono text-xs text-ob-muted'>{r.id}</span> },
    {
      key: 'date',
      header: 'Date & Time',
      render: (r: Reservation) => <span className='text-sm'>{formatDate(r.date)}</span>,
    },
    { key: 'guests', header: 'Guests', render: (r: Reservation) => <span>{r.guests}</span> },
    {
      key: 'table',
      header: 'Table',
      render: (r: Reservation) =>
        r.table ? (
          <span className='text-sm'>
            Table #{r.table.number} — {r.table.location?.name}
          </span>
        ) : (
          <span className='text-sm italic text-ob-muted'>Unassigned</span>
        ),
    },
    { key: 'status', header: 'Status', render: (r: Reservation) => <ReservationStatusBadge status={r.status} /> },
    {
      key: 'preOrders',
      header: 'Pre-orders',
      render: (r: Reservation) => <span className='text-xs text-ob-muted'>{r.preOrders.length > 0 ? `${r.preOrders.length} items` : '—'}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (r: Reservation) => (
        <div className='flex items-center gap-1 justify-end'>
          <button
            type='button'
            onClick={e => {
              e.stopPropagation();
              setEditTarget(r);
            }}
            className='btn-icon-ghost'
            aria-label='Edit reservation'
          >
            <IconEdit className='w-4 h-4' />
          </button>
          <button
            type='button'
            onClick={e => {
              e.stopPropagation();
              setDeleteTarget(r.id);
            }}
            className='btn-icon-ghost text-ob-error'
            aria-label='Delete reservation'
          >
            <IconTrash className='w-4 h-4' />
          </button>
        </div>
      ),
      className: 'w-24',
    },
  ];

  if (error) {
    return (
      <div className='page-container py-12'>
        <div className='card p-8 text-center space-y-4'>
          <p className='text-ob-error'>Failed to load reservations</p>
          <button type='button' className='btn-primary' onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='page-container py-12 space-y-8'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <h1 className='section-title'>Reservations</h1>
        <button type='button' className='btn-primary inline-flex items-center gap-2' onClick={() => setIsCreateOpen(true)}>
          <IconPlus className='w-4 h-4' /> New Reservation
        </button>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-4'>
        <div className='flex gap-1'>
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              type='button'
              onClick={() => updateFilter('status', s)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
                filters.status === s ? 'bg-ob-caramel text-white' : 'bg-ob-blue text-ob-text hover:bg-ob-border',
              )}
            >
              {s === 'ALL' ? 'All' : s}
            </button>
          ))}
        </div>

        <input
          type='date'
          value={filters.date}
          onChange={e => updateFilter('date', e.target.value)}
          className='input w-40'
          aria-label='Filter by date'
        />

        <div className='w-48'>
          <Select value={filters.location} onChange={v => updateFilter('location', v)} options={locationOptions} placeholder='Filter by location' />
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        rowKey={r => r.id}
        emptyMessage='No reservations found'
        emptyIcon='📅'
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <AdminReservationModal
        isOpen={!!editTarget || isCreateOpen}
        onClose={() => {
          setEditTarget(null);
          setIsCreateOpen(false);
          setFormError(null);
        }}
        reservation={editTarget}
        isPending={createMutation.isPending || updateMutation.isPending}
        error={formError}
        onSubmitCreate={data => {
          setFormError(null);
          createMutation.mutate(
            { ...data, date: new Date(data.date).toISOString() },
            {
              onSuccess: () => setIsCreateOpen(false),
              onError: err => setFormError(getErrorMessage(err)),
            },
          );
        }}
        onSubmitUpdate={data => {
          if (!editTarget) return;
          setFormError(null);
          updateMutation.mutate(
            {
              id: editTarget.id,
              body: { ...data, date: data.date ? new Date(data.date).toISOString() : undefined },
            },
            {
              onSuccess: () => setEditTarget(null),
              onError: err => setFormError(getErrorMessage(err)),
            },
          );
        }}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title='Delete reservation'
        message='This action cannot be undone.'
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget!, { onSettled: () => setDeleteTarget(null) })}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
