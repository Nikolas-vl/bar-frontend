import { useState } from 'react';
import { useAdminLocations, useCreateLocation, useUpdateLocation, useDeleteLocation, useToggleLocationActive } from '../hooks/useAdminLocations';
import { LocationCard } from '../components/LocationCard';
import { LocationFormModal } from '../components/LocationFormModal';
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog';
import { Skeleton } from '@/components/shared/ui';
import { IconPlus } from '@/assets/icons';
import { adminTablesApi } from '@/api/admin/tables.api';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/utils/queryKeys';
import type { Location } from '@/types';

export default function LocationsPage() {
  const { data: locations, isLoading, error, refetch } = useAdminLocations();
  const { data: allTables } = useQuery({ queryKey: queryKeys.tables.all, queryFn: () => adminTablesApi.getAll() });

  const createMutation = useCreateLocation();
  const updateMutation = useUpdateLocation();
  const deleteMutation = useDeleteLocation();
  const toggleMutation = useToggleLocationActive();

  const [editTarget, setEditTarget] = useState<Location | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const tableCountMap = (allTables ?? []).reduce<Record<number, number>>((acc, t) => {
    acc[t.locationId] = (acc[t.locationId] ?? 0) + 1;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className='page-container py-12 space-y-6'>
        <Skeleton className='h-8 w-40' />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-52 w-full' />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='page-container py-12'>
        <div className='card p-8 text-center space-y-4'>
          <p className='text-ob-error'>Failed to load locations</p>
          <button type='button' className='btn-primary' onClick={() => refetch()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className='page-container py-12 space-y-8'>
      <div className='flex items-center justify-between'>
        <h1 className='section-title'>Locations</h1>
        <button type='button' className='btn-primary inline-flex items-center gap-2' onClick={() => setIsCreateOpen(true)}>
          <IconPlus className='w-4 h-4' />
          Add Location
        </button>
      </div>

      {locations && locations.length === 0 ? (
        <div className='card p-12 flex flex-col items-center gap-3'>
          <span className='text-4xl'>📍</span>
          <p className='text-ob-muted text-sm'>No locations yet</p>
          <button type='button' className='btn-secondary' onClick={() => setIsCreateOpen(true)}>
            Create your first location
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {locations?.map(loc => (
            <LocationCard
              key={loc.id}
              location={loc}
              tableCount={tableCountMap[loc.id] || 0}
              onEdit={() => setEditTarget(loc)}
              onDelete={() => setDeleteTarget(loc.id)}
              onToggleActive={isActive => toggleMutation.mutate({ id: loc.id, isActive })}
              isToggling={toggleMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <LocationFormModal
        isOpen={!!editTarget || isCreateOpen}
        onClose={() => { setEditTarget(null); setIsCreateOpen(false); }}
        location={editTarget}
        isPending={createMutation.isPending || updateMutation.isPending}
        onSubmit={data => {
          if (editTarget) {
            updateMutation.mutate({ id: editTarget.id, body: data }, { onSuccess: () => setEditTarget(null) });
          } else {
            createMutation.mutate(data, { onSuccess: () => setIsCreateOpen(false) });
          }
        }}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title='Delete location'
        message='This action cannot be undone. Deleting a location with tables that have reservations will fail.'
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget!, { onSettled: () => setDeleteTarget(null) })}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
