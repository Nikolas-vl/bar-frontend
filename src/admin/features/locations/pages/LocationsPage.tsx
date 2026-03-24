import { useState } from 'react';
import { useAdminLocations, useCreateLocation, useUpdateLocation, useDeleteLocation, useToggleLocationActive } from '../hooks/useAdminLocations';
import { LocationCard } from '../components/LocationCard';
import { LocationFormModal } from '../components/LocationFormModal';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog';
import { ErrorState, EmptyState, LoadingState } from '@/shared/ui';
import { IconPlus } from '@/shared/assets/icons';
import type { Location } from '@/shared/types';
import { useAdminTables } from '@/admin/features/tables/hooks/useAdminTables';

export default function LocationsPage() {
  const { data: locations, isLoading, error, refetch } = useAdminLocations();
  const { data: allTables } = useAdminTables();

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
    return <LoadingState message='Loading locations...' />;
  }

  if (error) {
    return <ErrorState title='Failed to load locations' onRetry={refetch} />;
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
        <EmptyState
          title='No locations yet'
          icon='📍'
          action={
            <button type='button' className='btn-secondary' onClick={() => setIsCreateOpen(true)}>
              Create your first location
            </button>
          }
        />
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
        onClose={() => {
          setEditTarget(null);
          setIsCreateOpen(false);
        }}
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

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title='Delete location'
        message={
          deleteTarget !== null && (tableCountMap[deleteTarget] ?? 0) > 0
            ? `This location has ${tableCountMap[deleteTarget]} table(s). All tables must be removed before deleting the location.`
            : 'This action cannot be undone.'
        }
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget!, { onSettled: () => setDeleteTarget(null) })}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
