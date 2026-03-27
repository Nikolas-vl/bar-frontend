import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilteredPage } from '../../hooks/useFilteredPage';
import { useAdminReservations, useAdminCreateReservation, useAdminUpdateReservation, useAdminDeleteReservation } from '../hooks/useAdminReservations';
import { useAdminLocations } from '@/admin/features/locations/hooks/useAdminLocations';
import { AdminReservationModal } from '../components/AdminReservationModal';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog';
import { AdminTable } from '@/admin/components/AdminTable';
import { Pagination } from '@/admin/components/Pagination';
import { FilterPills } from '@/admin/components/FilterPills';
import { ErrorState } from '@/shared/ui/ErrorState';
import { Select } from '@/shared/ui/Select';
import { DateTimePicker } from '@/shared/ui/DateTimePicker/DayTimePicker';
import { ReservationStatusBadge } from '@/features/reservations/components/ReservationStatusBadge';
import { IconPlus, IconEdit, IconTrash, IconClose } from '@/shared/assets/icons';
import { formatDate } from '@/shared/lib/utils/cn';
import { getErrorMessage } from '@/shared/lib/api/client';
import type { Reservation } from '@/shared/types';

const STATUS_OPTIONS = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELED'] as const;
const LIMIT = 20;

export default function AdminReservationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, page, setPage, updateFilter, resetFilters } = useFilteredPage({
    status: 'ALL' as string,
    date: '',
    location: 'all',
  });

  const isFiltered = filters.status !== 'ALL' || filters.date !== '' || filters.location !== 'all';

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
      if (filters.location === 'all') return true;
      return r.table?.locationId === Number(filters.location);
    }) ?? [];

  const locationOptions = [{ value: 'all', label: 'All Locations' }, ...(locations ?? []).map(l => ({ value: String(l.id), label: l.name }))];

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
      render: (r: Reservation) => {
        if (r.preOrders.length === 0) return <span className='text-xs text-ob-muted italic'>—</span>;
        return (
          <details className='group'>
            <summary className='text-xs text-ob-caramel cursor-pointer font-medium hover:underline list-none focus:outline-none'>
              {r.preOrders.length} {r.preOrders.length === 1 ? 'item' : 'items'}
            </summary>
            <div className='mt-1 space-y-1 bg-ob-cream p-2 rounded-lg border border-ob-border animate-slide-down'>
              {r.preOrders.map(p => (
                <div key={p.id} className='text-[11px] leading-tight flex justify-between gap-2'>
                  <span className='font-medium'>{p.dish.name}</span>
                  <span className='text-ob-muted shrink-0'>×{p.quantity}</span>
                </div>
              ))}
            </div>
          </details>
        );
      },
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
    return <ErrorState title='Failed to load reservations' onRetry={refetch} />;
  }

  return (
    <div className='page-container py-12 space-y-8'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <h1 className='section-title'>Reservations</h1>
        <button type='button' className='btn-primary inline-flex items-center gap-2' onClick={() => setIsCreateOpen(true)}>
          <IconPlus className='w-4 h-4' /> New Reservation
        </button>
      </div>

      <div className='flex flex-wrap items-center gap-4'>
        <FilterPills
          options={STATUS_OPTIONS}
          value={filters.status as (typeof STATUS_OPTIONS)[number]}
          onChange={v => updateFilter('status', v)}
          labelMap={{ ALL: 'All' }}
        />

        <DateTimePicker value={filters.date} onChange={val => updateFilter('date', val)} aria-label='Filter by date' />

        <div className='w-48'>
          <Select value={filters.location} onChange={v => updateFilter('location', v)} options={locationOptions} placeholder='Filter by location' />
        </div>

        {isFiltered && (
          <button type='button' onClick={resetFilters} className='btn-ghost gap-2 text-ob-muted hover:text-ob-text'>
            <IconClose className='w-4 h-4' /> Clear Filters
          </button>
        )}
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
