import type { Settings, OrderType } from '@/shared/types';

export interface ClientPriceBreakdown {
  subtotal: number;
  discount: number;
  tax: number;
  deliveryFee: number;
  serviceFee: number;
  total: number;
}

/**
 * Client-side mirror of the backend `calcFinalTotal` utility.
 * Used for live fee preview in the checkout UI before the order is submitted.
 *
 * Delivery fee is only applied for DELIVERY order type (the backend stores
 * a flat fee that applies based on order type & free-delivery threshold).
 */
export function calcFinalTotalClient(subtotal: number, settings: Settings, orderType: OrderType, discountPercent = 0): ClientPriceBreakdown {
  const taxRate = parseFloat(settings.taxRate);
  const deliveryFeeBase = parseFloat(settings.deliveryFee);
  const serviceFee = parseFloat(settings.serviceFee);
  const freeDeliveryThreshold = parseFloat(settings.freeDeliveryThreshold);

  const discount = round(subtotal * (discountPercent / 100));
  const afterPromo = subtotal - discount;
  const tax = round(afterPromo * taxRate);

  // Delivery fee only for DELIVERY orders; waived above free-delivery threshold
  const deliveryFee = orderType === 'DELIVERY' ? (subtotal >= freeDeliveryThreshold ? 0 : deliveryFeeBase) : 0;

  const total = round(afterPromo + tax + deliveryFee + serviceFee);

  return {
    subtotal: round(subtotal),
    discount,
    tax,
    deliveryFee: round(deliveryFee),
    serviceFee: round(serviceFee),
    total,
  };
}

function round(v: number): number {
  return Math.round(v * 100) / 100;
}
