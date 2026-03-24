import { formatPrice } from '@/shared/lib/utils/cn';
import type { ClientPriceBreakdown } from '@/shared/lib/utils/pricingClient';
import type { OrderType } from '@/shared/types';

interface PriceBreakdownProps {
  breakdown: ClientPriceBreakdown;
  orderType: OrderType;
  taxRatePercent: number; // e.g. 0.23 → pass as 23
}

export function PriceBreakdown({ breakdown, orderType, taxRatePercent }: PriceBreakdownProps) {
  return (
    <div className='space-y-2.5 text-sm'>
      {/* Subtotal */}
      <div className='flex justify-between'>
        <span className='text-ob-muted'>Subtotal</span>
        <span className='text-ob-text font-medium'>{formatPrice(breakdown.subtotal.toFixed(2))}</span>
      </div>

      {/* Discount */}
      {breakdown.discount > 0 && (
        <div className='flex justify-between text-green-600'>
          <span>Discount</span>
          <span>− {formatPrice(breakdown.discount.toFixed(2))}</span>
        </div>
      )}

      {/* Tax */}
      <div className='flex justify-between'>
        <span className='text-ob-muted'>Tax ({Math.round(taxRatePercent)}%)</span>
        <span className='text-ob-text'>{formatPrice(breakdown.tax.toFixed(2))}</span>
      </div>

      {/* Delivery fee — only shown for DELIVERY orders */}
      {orderType === 'DELIVERY' && (
        <div className='flex justify-between'>
          <span className='text-ob-muted'>Delivery fee</span>
          {breakdown.deliveryFee === 0 ? (
            <span className='text-green-600 font-medium'>Free 🎉</span>
          ) : (
            <span className='text-ob-text'>{formatPrice(breakdown.deliveryFee.toFixed(2))}</span>
          )}
        </div>
      )}

      {/* Service fee */}
      <div className='flex justify-between'>
        <span className='text-ob-muted'>Service fee</span>
        <span className='text-ob-text'>{formatPrice(breakdown.serviceFee.toFixed(2))}</span>
      </div>

      {/* Total */}
      <div className='pt-2 border-t border-ob-border'>
        <div className='flex justify-between items-baseline'>
          <span className='font-semibold text-ob-text'>Total</span>
          <span className='font-display font-bold text-xl text-ob-caramel'>{formatPrice(breakdown.total.toFixed(2))}</span>
        </div>
      </div>
    </div>
  );
}
