import type { Cart, CartItem } from '../../../types';

export function getUnavailableItems(cart: Cart | undefined) {
  if (!cart) return [];
  return cart.items.filter(item => !item.dish.isAvailable);
}

export function hasUnavailableItems(cart: Cart | undefined): boolean {
  return getUnavailableItems(cart).length > 0;
}

/** Calculates total price for a single cart item including its extras */
export function calcItemTotal(item: CartItem): number {
  const base = parseFloat(String(item.dish.price));
  const extras = item.extras.reduce((sum, e) => sum + parseFloat(String(e.ingredient.price)) * e.quantity, 0);
  return (base + extras) * item.quantity;
}

/** Calculates the subtotal of the whole cart (all dish items) */
export function calcCartSubtotal(cart: Cart | undefined): number {
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + calcItemTotal(item), 0);
}

/** Total number of individual units in cart */
export function getTotalItemCount(cart: Cart | undefined): number {
  if (!cart) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
