import { useState, useEffect } from 'react';
import { useAdminOrders, useAdminUpdateOrderStatus, useAdminDeleteOrder } from '../hooks/useAdminOrders';
import { ConfirmDialog } from '@/features/admin/components/ConfirmDialog';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { Pagination } from '@/features/admin/components/Pagination';
import { Select } from '@/components/shared/ui';
import { Spinner } from '@/components/shared/ui';
import { OrderStatusBadge, PaymentStatusBadge } from '@/features/orders/components/orders/OrderStatusBadge';
import { IconTrash } from '@/assets/icons';
import { formatPrice, formatDate, cn } from '@/utils/cn';
import type { Order, OrderStatus, OrderType } from '@/types';

const STATUS_OPTIONS = ['ALL', 'NEW', 'PAID', 'PREPARING', 'COMPLETED', 'CANCELED'] as const;
const LIMIT = 20;

const ORDER_TYPE_ICON: Record<OrderType, string> = {
  DINE_IN: '🍽️',
  DELIVERY: '🛵',
  TAKE_OUT: '🥡',
};

const ORDER_TYPE_LABEL: Record<OrderType, string> = {
  DINE_IN: 'Dine In',
  DELIVERY: 'Delivery',
  TAKE_OUT: 'Take Out',
};

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ['PAID', 'CANCELED'],
  PAID: ['PREPARING', 'CANCELED'],
  PREPARING: ['COMPLETED', 'CANCELED'],
  COMPLETED: [],
  CANCELED: [],
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const params = {
    page,
    limit: LIMIT,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  };

  const { data, isLoading, error, refetch } = useAdminOrders(params);
  const updateStatusMutation = useAdminUpdateOrderStatus();
  const deleteMutation = useAdminDeleteOrder();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  const columns = [
    { key: 'id', header: '#', render: (o: Order) => <span className='font-mono text-xs'>#{o.id}</span> },
    {
      key: 'type',
      header: 'Type',
      render: (o: Order) => (
        <span className='inline-flex items-center gap-1.5'>
          <span>{ORDER_TYPE_ICON[o.type]}</span>
          <span className='text-xs'>{ORDER_TYPE_LABEL[o.type]}</span>
        </span>
      ),
    },
    {
      key: 'items',
      header: 'Items',
      render: (o: Order) => (
        <span className='text-xs text-ob-muted truncate max-w-[200px] block'>
          {o.items.map(i => `${i.dish.name} x${i.quantity}`).join(', ') || '—'}
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      render: (o: Order) => <span className='font-mono text-sm font-semibold text-ob-caramel'>{formatPrice(o.total)}</span>,
    },
    { key: 'status', header: 'Status', render: (o: Order) => <OrderStatusBadge status={o.status} /> },
    {
      key: 'payment',
      header: 'Payment',
      render: (o: Order) => <PaymentStatusBadge status={o.paymentStatus} type={o.payments?.[0]?.type} />,
    },
    {
      key: 'date',
      header: 'Date',
      render: (o: Order) => <span className='text-xs text-ob-muted'>{formatDate(o.createdAt)}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (o: Order) => (
        <button
          type='button'
          onClick={e => {
            e.stopPropagation();
            setDeleteTarget(o.id);
          }}
          className='btn-icon-ghost text-ob-error'
          aria-label='Delete order'
        >
          <IconTrash className='w-4 h-4' />
        </button>
      ),
      className: 'w-14',
    },
  ];

  const renderExpanded = (o: Order) => {
    const transitions = ALLOWED_TRANSITIONS[o.status];
    const transitionOptions = transitions.map(s => ({ value: s, label: s }));

    return (
      <div className='space-y-4'>
        {/* Items detail */}
        <div>
          <h4 className='text-xs font-semibold uppercase tracking-wider text-ob-muted mb-2'>Order Items</h4>
          <div className='space-y-2'>
            {o.items.map(item => (
              <div key={item.id} className='flex items-start justify-between text-sm'>
                <div>
                  <span className='font-medium'>{item.dish.name}</span>
                  <span className='text-ob-muted'> ×{item.quantity}</span>
                  {item.note && <p className='text-xs text-ob-muted italic mt-0.5'>Note: {item.note}</p>}
                  {item.extras.length > 0 && (
                    <p className='text-xs text-ob-muted mt-0.5'>Extras: {item.extras.map(e => e.ingredient.name).join(', ')}</p>
                  )}
                </div>
                <span className='font-mono text-xs'>{formatPrice(Number(item.dish.price) * item.quantity)}</span>
              </div>
            ))}
            {o.ingredientItems.map(item => (
              <div key={item.id} className='flex items-start justify-between text-sm'>
                <span className='font-medium'>
                  {item.ingredient.name} ×{item.quantity}
                </span>
                <span className='font-mono text-xs'>{formatPrice(Number(item.ingredient.price) * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        {o.type === 'DELIVERY' && o.address && (
          <div>
            <h4 className='text-xs font-semibold uppercase tracking-wider text-ob-muted mb-1'>Delivery Address</h4>
            <p className='text-sm'>
              {o.address.street}, {o.address.zip} {o.address.city}
            </p>
          </div>
        )}

        {/* Comment */}
        {o.comment && (
          <div>
            <h4 className='text-xs font-semibold uppercase tracking-wider text-ob-muted mb-1'>Comment</h4>
            <p className='text-sm text-ob-muted'>{o.comment}</p>
          </div>
        )}

        {/* Price breakdown */}
        <div className='grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs'>
          <div>
            <span className='text-ob-muted'>Subtotal:</span> {formatPrice(o.subtotal)}
          </div>
          <div>
            <span className='text-ob-muted'>Tax:</span> {formatPrice(o.tax)}
          </div>
          <div>
            <span className='text-ob-muted'>Delivery:</span> {formatPrice(o.deliveryFee)}
          </div>
          <div>
            <span className='text-ob-muted'>Service:</span> {formatPrice(o.serviceFee)}
          </div>
          <div className='font-semibold'>
            <span className='text-ob-muted'>Total:</span> {formatPrice(o.total)}
          </div>
        </div>

        {/* Status update */}
        {transitions.length > 0 && (
          <div className='flex items-center gap-3 pt-3 border-t border-ob-border'>
            <span className='text-xs text-ob-muted'>Update status:</span>
            <Select
              value=''
              onChange={v => updateStatusMutation.mutate({ id: o.id, status: v as OrderStatus })}
              options={transitionOptions}
              placeholder='Select new status…'
              disabled={updateStatusMutation.isPending}
              className='w-48'
            />
            {updateStatusMutation.isPending && <Spinner variant='caramel' size='sm' />}
          </div>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <div className='page-container py-12'>
        <div className='card p-8 text-center space-y-4'>
          <p className='text-ob-error'>Failed to load orders</p>
          <button type='button' className='btn-primary' onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='page-container py-12 space-y-8'>
      <h1 className='section-title'>Orders</h1>

      {/* Status filter */}
      <div className='flex flex-wrap gap-1'>
        {STATUS_OPTIONS.map(s => (
          <button
            key={s}
            type='button'
            onClick={() => setStatusFilter(s)}
            className={cn(
              'px-3 py-1.5 text-xs font-medium rounded-full transition-colors',
              statusFilter === s ? 'bg-ob-caramel text-white' : 'bg-ob-blue text-ob-text hover:bg-ob-border',
            )}
          >
            {s === 'ALL' ? 'All' : s}
          </button>
        ))}
      </div>

      <AdminTable
        columns={columns}
        data={data?.orders ?? []}
        isLoading={isLoading}
        rowKey={o => o.id}
        onRowClick={o => setExpandedId(expandedId === o.id ? null : o.id)}
        expandedRow={expandedId}
        renderExpanded={renderExpanded}
        emptyMessage='No orders found'
        emptyIcon='📦'
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title='Delete order'
        message='This will permanently remove this order.'
        isPending={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(deleteTarget!, { onSettled: () => setDeleteTarget(null) })}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
