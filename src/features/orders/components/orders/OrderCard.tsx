import { Link, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import type { Order } from '@/shared/types';
import { formatPrice } from '@/shared/lib/utils/cn';
import { OrderStatusBadge, PaymentStatusBadge } from './OrderStatusBadge';
import { ORDER_TYPE_CONFIG } from '@/shared/constants/order';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const location = useLocation();

  return (
    <Link
      to={`/orders/${order.id}`}
      state={{ from: { pathname: location.pathname, search: location.search, hash: location.hash } }}
      className='card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-[0_8px_32px_rgba(47,47,47,0.10)] hover:-translate-y-0.5 transition-all duration-200'
    >
      <div className='flex-1 min-w-0 flex flex-col gap-1.5'>
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='text-lg leading-none'>{ORDER_TYPE_CONFIG[order.type].icon}</span>

          <span className='font-display font-semibold text-ob-text'>Order #{order.id}</span>

          <span className='text-xs text-ob-muted font-medium'>{ORDER_TYPE_CONFIG[order.type].label}</span>
          <OrderStatusBadge status={order.status} />
        </div>

        <p className='text-xs text-ob-muted'>{format(new Date(order.createdAt), 'MMM d, yyyy · HH:mm')}</p>

        <p className='text-xs text-ob-muted truncate'>{order.items.map(i => `${i.dish.name} ×${i.quantity}`).join(', ')}</p>
      </div>

      <div className='flex sm:flex-col items-center sm:items-end gap-3 shrink-0'>
        <span className='font-display font-bold text-lg text-ob-caramel'>{formatPrice(order.total)}</span>
        <PaymentStatusBadge status={order.paymentStatus} />
      </div>
    </Link>
  );
}
