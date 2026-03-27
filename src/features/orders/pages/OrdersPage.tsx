import { useState } from 'react';
import { useMyOrders } from '../hooks/useMyOrders';
import { OrderCard } from '../components/orders/OrderCard';
import { Skeleton } from '@/shared/ui';
import type { OrderStatus } from '@/shared/types';
import { ORDER_STATUS_FILTER_ITEMS } from '@/shared/constants/order';

export default function OrdersPage() {
  const [status, setStatus] = useState<OrderStatus | undefined>();
  const { data, isLoading } = useMyOrders({ status, limit: 20 });

  return (
    <div className='page-container py-10'>
      <h1 className='font-display text-3xl font-semibold mb-2 text-ob-text'>My Orders</h1>
      <p className='text-sm text-ob-muted mb-7'>Track and manage your past orders</p>

      {/* Status filter */}
      <div className='flex gap-2 flex-wrap mb-6'>
        {ORDER_STATUS_FILTER_ITEMS.map(filter => (
          <button
            key={filter.option}
            onClick={() => setStatus(filter.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              status === filter.value
                ? 'bg-ob-caramel border-ob-caramel text-white'
                : 'bg-ob-surface border-ob-border text-ob-muted hover:opacity-80'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className='flex flex-col gap-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-28 rounded-2xl' />
          ))}
        </div>
      )}

      {!isLoading && data?.orders.length === 0 && (
        <div className='flex flex-col items-center py-20 gap-3 text-center'>
          <span className='text-5xl'>📋</span>
          <p className='font-display font-semibold text-ob-text'>No orders yet</p>
          <p className='text-sm text-ob-muted'>Your order history will appear here</p>
        </div>
      )}

      {!isLoading && data && data.orders.length > 0 && (
        <div className='flex flex-col gap-4'>
          {data.orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
