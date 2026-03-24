import type { Cart, CartItem, OrderItem } from '@/shared/types';

/**
 * Shared type for items that have the same pricing structure.
 * Avoids duplication between CartItem and OrderItem.
 */
type PriceableItem = {
  dish: { price: number | string };
  extras: { ingredient: { price: number | string }; quantity: number }[];
  quantity: number;
};

/** Safe number conversion — handles both string (from JSON/Prisma Decimal) and number */
function toNumber(value: number | string): number {
  return typeof value === 'number' ? value : parseFloat(value);
}

/**
 * Calculates total price for any item (cart or order) including extras.
 * Generic so it works with CartItem, OrderItem, or any compatible shape.
 *
 * NOTE: this is the per-item subtotal only.
 * For the full checkout breakdown (tax, fees, discount) use calcFinalTotalClient.
 */
export function calcItemTotal<T extends PriceableItem>(item: T): number {
  const base = toNumber(item.dish.price);
  const extrasTotal = item.extras.reduce((sum, e) => sum + toNumber(e.ingredient.price) * e.quantity, 0);
  return (base + extrasTotal) * item.quantity;
}

/**
 * Semantic wrapper for order items.
 * Keeps call sites readable: calcOrderItemTotal(item) vs calcItemTotal(item).
 */
export function calcOrderItemTotal(item: OrderItem): number {
  return calcItemTotal(item);
}

/** Get unavailable dishes from cart */
export function getUnavailableItems(cart: Cart | undefined): CartItem[] {
  if (!cart) return [];
  return cart.items.filter(item => !item.dish.isAvailable);
}

/** Check if cart has any unavailable items */
export function hasUnavailableItems(cart: Cart | undefined): boolean {
  return getUnavailableItems(cart).length > 0;
}

/**
 * Calculates subtotal of the whole cart.
 * Includes both dish items (with extras) and standalone ingredient items.
 */
export function calcCartSubtotal(cart: Cart | undefined): number {
  if (!cart) return 0;

  const itemsSubtotal = cart.items.reduce((sum, item) => sum + calcItemTotal(item), 0);

  const ingredientsSubtotal = (cart.ingredientItems ?? []).reduce((sum, item) => sum + toNumber(item.ingredient.price) * item.quantity, 0);

  return itemsSubtotal + ingredientsSubtotal;
}

/** Total number of all units in cart (dish items + ingredient items) */
export function getTotalItemCount(cart: Cart | undefined): number {
  if (!cart) return 0;

  const dishCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const ingredientCount = (cart.ingredientItems ?? []).reduce((sum, item) => sum + item.quantity, 0);

  return dishCount + ingredientCount;
}
