import { useState, useEffect } from 'react';
import { useAdminUsers, useAdminUpdateUser, useAdminDeleteUser } from '../hooks/useAdminUsers';
import { EditUserModal } from '../components/EditUserModal';
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { Pagination } from '@/features/admin/components/Pagination';
import { SearchInput, useDebouncedSearch } from '@/features/admin/components/SearchInput';
import { IconEdit, IconTrash } from '@/assets/icons';
import { formatDateShort, cn } from '@/utils/cn';
import type { AdminUserWithDate } from '@/api/admin/users.api';

const ROLES = ['ALL', 'USER', 'ADMIN'] as const;
const LIMIT = 20;

export default function UsersPage() {
  const [searchInput, setSearchInput, debouncedSearch] = useDebouncedSearch();
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [debouncedSearch, roleFilter]);

  const params = {
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    role: roleFilter === 'ALL' ? undefined : roleFilter,
  };
  const { data, isLoading, error, refetch } = useAdminUsers(params);
  const updateMutation = useAdminUpdateUser();
  const deleteMutation = useAdminDeleteUser();

  const [editTarget, setEditTarget] = useState<AdminUserWithDate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  const columns = [
    { key: 'id', header: '#', render: (u: AdminUserWithDate) => <span className='font-mono text-xs text-ob-muted'>{u.id}</span> },
    { key: 'name', header: 'Name', render: (u: AdminUserWithDate) => <span className='font-semibold'>{u.name ?? '—'}</span> },
    { key: 'email', header: 'Email', render: (u: AdminUserWithDate) => <span className='text-ob-muted text-sm'>{u.email}</span> },
    { key: 'phone', header: 'Phone', render: (u: AdminUserWithDate) => <span className='text-sm'>{u.phone ?? '—'}</span> },
    {
      key: 'role',
      header: 'Role',
      render: (u: AdminUserWithDate) => (
        <span className={cn(
          'badge',
          u.role === 'ADMIN' ? 'bg-ob-caramel/15 text-ob-caramel' : 'bg-ob-blue text-ob-text',
        )}>
          {u.role}
        </span>
      ),
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
          <button type='button' onClick={() => setDeleteTarget(u.id)} className='btn-icon-ghost text-ob-error' aria-label='Delete user'>
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
          <p className='text-ob-error'>Failed to load users</p>
          <button type='button' className='btn-primary' onClick={() => refetch()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className='page-container py-12 space-y-8'>
      <h1 className='section-title'>Users</h1>

      {/* Toolbar */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div className='flex flex-wrap items-center gap-3'>
          <SearchInput value={searchInput} onChange={setSearchInput} placeholder='Search users…' className='w-64' />
          <div className='flex gap-1'>
            {ROLES.map(role => (
              <button
                key={role}
                type='button'
                onClick={() => setRoleFilter(role)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
                  roleFilter === role
                    ? 'bg-ob-caramel text-white'
                    : 'bg-ob-blue text-ob-text hover:bg-ob-border',
                )}
              >
                {role === 'ALL' ? 'All' : role}
              </button>
            ))}
          </div>
        </div>
        {data && <span className='text-sm text-ob-muted'>{data.total} users</span>}
      </div>

      <AdminTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        rowKey={u => u.id}
        emptyMessage='No users found'
        emptyIcon='👤'
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* Edit Modal */}
      <EditUserModal
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        user={editTarget}
        isPending={updateMutation.isPending}
        onSubmit={data => {
          if (editTarget) {
            updateMutation.mutate(
              { id: editTarget.id, body: data },
              { onSuccess: () => setEditTarget(null) },
            );
          }
        }}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title='Delete user'
        message='This action cannot be undone. Users with existing orders cannot be deleted.'
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget!, { onSettled: () => setDeleteTarget(null) })}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
