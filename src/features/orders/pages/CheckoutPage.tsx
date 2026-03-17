import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '../../cart/hooks/useCart';
import { usePaymentMethods } from '../../payments/hooks/usePaymentMethods';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { usePayOrder } from '../hooks/usePayOrder';
import { hasUnavailableItems } from '../../cart/utils/cartUtils';
import { OrderTypeSelector } from '../components/checkout/OrderTypeSelector';
import { PaymentMethodSelector } from '../components/checkout/PaymentMethodSelector';
import { CartSummary } from '../components/checkout/CartSummary';
import { Spinner } from '@/components/shared/ui';
import { formatPrice } from '@/utils/cn';
import { getErrorMessage } from '@/api/client';
import type { OrderType, PaymentType } from '@/types';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: savedCards = [] } = usePaymentMethods();
  const { mutateAsync: createOrder } = useCreateOrder();

  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [paymentType, setPaymentType] = useState<PaymentType>('CASH');
  const [paymentMethodId, setPaymentMethodId] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // usePayOrder needs orderId — we wire it after order creation
  const { mutateAsync: payOrder } = usePayOrder();

  const isEmpty = !cart || cart.items.length === 0;
  const blocked = hasUnavailableItems(cart);
  const cardRequired = paymentType === 'CARD' && !paymentMethodId;

  const handleSubmit = async () => {
    if (isEmpty || blocked || cardRequired) return;
    setIsSubmitting(true);
    try {
      const order = await createOrder({
        type: orderType,
        comment: comment.trim() || undefined,
        discountPercent: 0,
      });

      const result = await payOrder({
        orderId: order.id,
        type: paymentType,
        ...(paymentType === 'CARD' && paymentMethodId ? { paymentMethodId } : {}),
      });

      if (result.success) {
        toast.success('Order placed successfully! 🎉');
      } else {
        toast.error(result.message);
      }
      navigate(`/orders/${order.id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <div className='page-container py-16 flex justify-center'>
        <Spinner variant='caramel' size='md' />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className='page-container py-16 text-center'>
        <p className='text-ob-muted mb-4'>Your cart is empty.</p>
        <Link to='/menu' className='btn-primary'>
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className='page-container py-10'>
      <Link to='/menu' className='inline-flex items-center gap-1.5 text-sm mb-6 hover:opacity-80 transition-opacity text-ob-muted'>
        ← Back to Menu
      </Link>

      <h1 className='font-display text-3xl font-semibold mb-8 text-ob-text'>Checkout</h1>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
        {/* ── Left column — options ── */}
        <div className='lg:col-span-3 flex flex-col gap-6'>
          {/* Order type */}
          <div className='card p-5'>
            <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ob-muted'>Order Type</h2>
            <OrderTypeSelector value={orderType} onChange={setOrderType} />
          </div>

          {/* Payment */}
          <div className='card p-5'>
            <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ob-muted'>Payment</h2>
            <PaymentMethodSelector
              paymentType={paymentType}
              paymentMethodId={paymentMethodId}
              savedCards={savedCards}
              onTypeChange={t => {
                setPaymentType(t);
                setPaymentMethodId(null);
              }}
              onCardChange={setPaymentMethodId}
            />
            {cardRequired && <p className='text-xs text-ob-error mt-2'>Please select a saved card.</p>}
          </div>

          {/* Comment */}
          <div className='card p-5'>
            <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ob-muted'>Special Instructions</h2>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder='Any requests for the kitchen or delivery…'
              maxLength={1000}
              rows={3}
              className='input w-full resize-none'
            />
          </div>
        </div>

        {/* ── Right column — summary ── */}
        <div className='lg:col-span-2'>
          <div className='card p-5 sticky top-24'>
            <h2 className='font-display font-semibold text-sm uppercase tracking-wider mb-4 text-ob-muted'>Order Summary</h2>

            <CartSummary cart={cart} />

            {blocked && (
              <div className='mt-4 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3'>
                <p className='text-xs text-amber-700 font-semibold'>⚠️ Unavailable items in cart</p>
              </div>
            )}

            <button onClick={handleSubmit} disabled={isSubmitting || blocked || cardRequired} className='btn-primary w-full justify-center mt-5'>
              {isSubmitting ? (
                <span className='flex items-center gap-2'>
                  <Spinner variant='white' />
                  Placing order…
                </span>
              ) : (
                `Place Order · ${formatPrice(parseFloat(cart?.items.reduce((s, i) => s + parseFloat(i.dish.price) * i.quantity, 0).toFixed(2) ?? '0'))}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
