import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useMyOrder } from '../hooks/useMyOrder';
import { useCancelOrder } from '../hooks/useCancelOrder';
import { OrderStatusBadge, PaymentStatusBadge } from '../components/orders/OrderStatusBadge';
import { AppImage, Skeleton, Spinner } from '@/components/shared/ui';
import { formatPrice } from '@/utils/cn';
import { getErrorMessage } from '@/api/client';
import { calcOrderItemTotal } from '@/features/cart/utils/cartUtils';
import type { OrderStatus, PaymentType } from '@/types';

const TYPE_LABEL: Record<string, string> = {
  DINE_IN: '🍽️ Dine In',
  DELIVERY: '🛵 Delivery',
  TAKE_OUT: '🥡 Take Out',
};

const PAYMENT_TYPE_LABEL: Record<PaymentType, string> = {
  CASH: '💵 Cash',
  BLIK: '📱 BLIK',
  CARD: '💳 Card',
};

const CANCELABLE_STATUSES: OrderStatus[] = ['NEW', 'PAID'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = Number(id);

  const { data: order, isLoading, error } = useMyOrder(orderId);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  if (isLoading) {
    return (
      <div className='page-container py-10 max-w-2xl mx-auto flex flex-col gap-4'>
        <Skeleton className='h-8 w-48 rounded-xl' />
        <Skeleton className='h-32 rounded-2xl' />
        <Skeleton className='h-48 rounded-2xl' />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className='page-container py-10 text-center'>
        <p className='text-ob-muted mb-4'>Order not found.</p>
        <Link to='/orders' className='btn-primary'>
          ← My Orders
        </Link>
      </div>
    );
  }

  const handleCancel = () => {
    cancelOrder(order.id, {
      onSuccess: () => toast.success('Order cancelled'),
      onError: err => toast.error(getErrorMessage(err)),
    });
  };

  const latestPayment = order.payments.at(-1);
  const wasPaid = order.paymentStatus === 'SUCCESS';
  const isCancelable = CANCELABLE_STATUSES.includes(order.status);

  return (
    <div className='page-container py-10'>
      <Link to='/orders' className='inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity text-ob-muted'>
        ← My Orders
      </Link>

      <div className='max-w-2xl mx-auto flex flex-col gap-5'>
        {/* ── Canceled notice ──────────────────────────── */}
        {order.status === 'CANCELED' && (
          <div className={`rounded-2xl px-5 py-4 border ${wasPaid ? 'bg-blue-50 border-blue-200' : 'bg-ob-border/30 border-ob-border'}`}>
            <p className={`text-sm font-semibold mb-1 ${wasPaid ? 'text-blue-700' : 'text-ob-muted'}`}>
              {wasPaid ? '↩️ Order canceled — refund in progress' : '🚫 Order canceled'}
            </p>
            <p className={`text-xs leading-relaxed ${wasPaid ? 'text-blue-600' : 'text-ob-light'}`}>
              {wasPaid
                ? `Your payment of ${formatPrice(order.total)} will be returned to your original payment method within 3–5 business days.`
                : 'This order was canceled and no payment was charged.'}
            </p>
          </div>
        )}

        {/* ── Header card ─────────────────────────────── */}
        <div className='card p-5'>
          <div className='flex items-start justify-between gap-4 mb-4'>
            <div>
              <h1 className='font-display text-2xl font-semibold text-ob-text mb-1'>Order #{order.id}</h1>
              <p className='text-sm text-ob-muted'>{format(new Date(order.createdAt), 'MMMM d, yyyy · HH:mm')}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            {[
              { label: 'Type', value: TYPE_LABEL[order.type] },
              { label: 'Subtotal', value: formatPrice(order.subtotal) },
              { label: 'Tax', value: formatPrice(order.tax) },
              { label: 'Total', value: formatPrice(order.total), highlight: true },
            ].map(s => (
              <div key={s.label} className='bg-ob-bg rounded-xl p-3 text-center'>
                <p className='text-[10px] uppercase tracking-wider text-ob-muted mb-1'>{s.label}</p>
                <p className={`font-display font-semibold text-sm ${s.highlight ? 'text-ob-caramel' : 'text-ob-text'}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {order.comment && <p className='mt-4 text-sm text-ob-muted italic border-t border-ob-border pt-3'>"{order.comment}"</p>}
        </div>

        {/* ── Payment card ─────────────────────────────── */}
        <div className='card p-5'>
          <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ob-muted'>Payment</h2>

          {latestPayment ? (
            <>
              <div className='flex items-center justify-between'>
                <div className='flex flex-col gap-1'>
                  <span className='text-sm font-medium text-ob-text'>{PAYMENT_TYPE_LABEL[latestPayment.type]}</span>
                  <span className='text-xs text-ob-muted'>{format(new Date(latestPayment.createdAt), 'MMM d, yyyy · HH:mm')}</span>
                </div>
                <div className='flex flex-col items-end gap-1.5'>
                  <PaymentStatusBadge status={latestPayment.status} type={latestPayment.type} />
                  <span className='text-sm font-semibold text-ob-caramel'>{formatPrice(latestPayment.amount)}</span>
                </div>
              </div>

              {latestPayment.type === 'CASH' && latestPayment.status === 'PENDING' && (
                <p className='mt-3 text-xs rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-amber-700 leading-relaxed'>
                  💵 Please bring <strong>{formatPrice(order.total)}</strong> to the counter when your order is ready.
                </p>
              )}

              {latestPayment.status === 'FAILED' && latestPayment.type !== 'CASH' && (
                <p className='mt-3 text-xs rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-red-700 leading-relaxed'>
                  ❌ Payment failed. Please contact staff or try a different method.
                </p>
              )}
            </>
          ) : (
            <div className='flex items-center justify-between'>
              <span className='text-sm text-ob-muted'>No payment recorded yet</span>
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
          )}
        </div>

        {/* ── Dish items ───────────────────────────────── */}
        {order.items.length > 0 && (
          <div className='card p-5'>
            <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ob-muted'>Items</h2>
            <div className='flex flex-col gap-4'>
              {order.items.map(item => (
                <div key={item.id} className='flex items-center gap-3'>
                  <div className='w-14 h-14 rounded-xl overflow-hidden shrink-0'>
                    <AppImage src={item.dish.imageUrl} alt={item.dish.name} aspectRatio='square' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-ob-text'>{item.dish.name}</p>
                    {item.extras.length > 0 && <p className='text-[11px] text-ob-muted'>+ {item.extras.map(e => e.ingredient.name).join(', ')}</p>}
                    {item.note && <p className='text-[11px] italic text-ob-muted'>"{item.note}"</p>}
                  </div>
                  <div className='text-right shrink-0'>
                    <p className='text-xs text-ob-muted'>×{item.quantity}</p>
                    {/* ✅ shared util — no local duplicate */}
                    <p className='text-sm font-semibold text-ob-caramel'>{formatPrice(calcOrderItemTotal(item).toFixed(2))}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Ingredient-only items ────────────────────── */}
        {order.ingredientItems.length > 0 && (
          <div className='card p-5'>
            <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ob-muted'>Extra Ingredients</h2>
            <div className='flex flex-col gap-2'>
              {order.ingredientItems.map(item => (
                <div key={item.id} className='flex justify-between text-sm'>
                  <span className='text-ob-text'>
                    {item.ingredient.name} ×{item.quantity}
                  </span>
                  <span className='font-semibold text-ob-caramel'>{formatPrice((parseFloat(item.ingredient.price) * item.quantity).toFixed(2))}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Actions ──────────────────────────────────── */}
        {isCancelable && (
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className='btn-outline border-ob-error text-ob-error hover:bg-ob-error/5 w-full justify-center'
          >
            {isCancelling ? <Spinner variant='caramel' /> : wasPaid ? 'Cancel Order & Request Refund' : 'Cancel Order'}
          </button>
        )}

        {order.status === 'COMPLETED' && (
          <Link to='/menu' className='btn-primary w-full justify-center'>
            Order Again
          </Link>
        )}
      </div>
    </div>
  );
}
