import { useState } from 'react';
import { useFilteredPage } from '../../hooks/useFilteredPage';
import { useAdminUsers, useAdminUpdateUser, useAdminDeleteUser } from '../hooks/useAdminUsers';
import { EditUserModal } from '../components/EditUserModal';
import { ConfirmDialog } from '@/admin/components/ConfirmDialog';
import { AdminTable } from '@/admin/components/AdminTable';
import { Pagination } from '@/admin/components/Pagination';
import { SearchInput } from '@/admin/components/SearchInput';
import { FilterPills } from '@/admin/components/FilterPills';
import { ErrorState } from '@/shared/ui';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { IconEdit, IconTrash, IconClose } from '@/shared/assets/icons';
import { formatDateShort, cn } from '@/shared/lib/utils/cn';
import { ROLE_CONFIG, ROLE_FILTER_LABEL, ROLE_FILTER_OPTIONS, type RoleFilterValue } from '@/shared/constants/user';
import type { AdminUserWithDate } from '@/shared/types';

const LIMIT = 20;

export default function UsersPage() {
  const { filters, page, setPage, updateFilter, resetFilters } = useFilteredPage({
    search: '',
    role: 'ALL' as string,
  });

  const isFiltered = filters.search !== '' || filters.role !== 'ALL';

  const debouncedSearch = useDebounce(filters.search, 500);

  const params = {
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    role: filters.role === 'ALL' ? undefined : filters.role,
  };
  const { data, isLoading, error, refetch } = useAdminUsers(params);
  const updateMutation = useAdminUpdateUser();
  const deleteMutation = useAdminDeleteUser();

  const [editTarget, setEditTarget] = useState<AdminUserWithDate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  // Message in the confirm dialog explains why deletion may be blocked.
  const deleteMessage =
    'This action cannot be undone. ' + 'Users with existing orders or payments cannot be deleted — ' + 'the request will fail if that is the case.';

  const columns = [
    {
      key: 'id',
      header: '#',
      render: (u: AdminUserWithDate) => <span className='font-mono text-xs text-ob-muted'>{u.id}</span>,
    },
    {
      key: 'name',
      header: 'Name',
      render: (u: AdminUserWithDate) => <span className='font-semibold'>{u.name ?? '—'}</span>,
    },
    {
      key: 'email',
      header: 'Email',
      render: (u: AdminUserWithDate) => <span className='text-ob-muted text-sm'>{u.email}</span>,
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (u: AdminUserWithDate) => <span className='text-sm'>{u.phone ?? '—'}</span>,
    },
    {
      key: 'role',
      header: 'Role',
      render: (u: AdminUserWithDate) => <span className={cn('badge', ROLE_CONFIG[u.role].badgeClass)}>{ROLE_CONFIG[u.role].label}</span>,
    },
    {
      key: 'joined',
      header: 'Joined',
      render: (u: AdminUserWithDate) => <span className='text-xs text-ob-muted'>{formatDateShort(u.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (u: AdminUserWithDate) => (
        <div className='flex items-center gap-1 justify-end'>
          <button type='button' onClick={() => setEditTarget(u)} className='btn-icon-ghost' aria-label='Edit user'>
            <IconEdit className='w-4 h-4' />
          </button>
          {/* Admins cannot be deleted — disable the button with a tooltip hint. */}
          <button
            type='button'
            onClick={() => setDeleteTarget(u.id)}
            disabled={u.role === 'ADMIN'}
            title={u.role === 'ADMIN' ? 'Admin accounts cannot be deleted' : 'Delete user'}
            className='btn-icon-ghost text-ob-error disabled:opacity-30 disabled:cursor-not-allowed'
            aria-label='Delete user'
          >
            <IconTrash className='w-4 h-4' />
          </button>
        </div>
      ),
      className: 'w-24',
    },
  ];

  if (error) {
    return <ErrorState title='Failed to load users' onRetry={refetch} />;
  }

  return (
    <div className='page-container py-12 space-y-8'>
      <h1 className='section-title'>Users</h1>

      {/* Toolbar */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex flex-wrap items-center gap-3'>
          <SearchInput value={filters.search} onChange={v => updateFilter('search', v)} placeholder='Search users…' className='w-64' />
          <FilterPills
            options={ROLE_FILTER_OPTIONS}
            value={filters.role as RoleFilterValue}
            onChange={v => updateFilter('role', v)}
            labelMap={ROLE_FILTER_LABEL}
          />
          {isFiltered && (
            <button type='button' onClick={resetFilters} className='btn-ghost gap-2 text-ob-muted hover:text-ob-text'>
              <IconClose className='w-4 h-4' /> Clear Filters
            </button>
          )}
        </div>
        {data && <span className='text-sm text-ob-muted'>{data.total} users</span>}
      </div>

      <AdminTable columns={columns} data={data?.users ?? []} isLoading={isLoading} rowKey={u => u.id} emptyMessage='No users found' emptyIcon='👤' />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* Edit Modal */}
      <EditUserModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        user={editTarget}
        isPending={updateMutation.isPending}
        onSubmit={data => {
          if (editTarget) {
            updateMutation.mutate({ id: editTarget.id, body: data }, { onSuccess: () => setEditTarget(null) });
          }
        }}
      />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title='Delete user'
        message={deleteMessage}
        isPending={deleteMutation.isPending}
        onConfirm={() =>
          deleteMutation.mutate(deleteTarget!, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
