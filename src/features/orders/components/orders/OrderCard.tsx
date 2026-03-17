import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import type { Order } from '@/types';
import { formatPrice } from '@/utils/cn';
import { OrderStatusBadge, PaymentStatusBadge } from './OrderStatusBadge';

const TYPE_ICON: Record<string, string> = {
  DINE_IN: '🍽️',
  DELIVERY: '🛵',
  TAKE_OUT: '🥡',
};

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link
      to={`/orders/${order.id}`}
      className='card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-[0_8px_32px_rgba(47,47,47,0.10)] hover:-translate-y-0.5 transition-all duration-200'
    >
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2 mb-1'>
          <span className='text-lg'>{TYPE_ICON[order.type]}</span>
          <span className='font-display font-semibold text-ob-text'>Order #{order.id}</span>
          <OrderStatusBadge status={order.status} />
        </div>

        <p className='text-xs text-ob-muted mb-2'>{format(new Date(order.createdAt), 'MMM d, yyyy · HH:mm')}</p>

        <p className='text-xs text-ob-muted truncate'>{order.items.map(i => `${i.dish.name} ×${i.quantity}`).join(', ')}</p>
      </div>

      <div className='flex sm:flex-col items-center sm:items-end gap-3 shrink-0'>
        <span className='font-display font-bold text-lg text-ob-caramel'>{formatPrice(order.total)}</span>
        <PaymentStatusBadge status={order.paymentStatus} />
      </div>
    </Link>
  );
}
