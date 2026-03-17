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

/**
 * Calculates the subtotal of the whole cart.
 * Includes both dish items (with extras) and standalone ingredient items.
 */
export function calcCartSubtotal(cart: Cart | undefined): number {
  if (!cart) return 0;

  const itemsSubtotal = cart.items.reduce((sum, item) => sum + calcItemTotal(item), 0);
  const ingredientsSubtotal = (cart.ingredientItems ?? []).reduce((sum, item) => sum + parseFloat(String(item.ingredient.price)) * item.quantity, 0);

  return itemsSubtotal + ingredientsSubtotal;
}

/** Total number of individual units in cart (dishes + standalone ingredients) */
export function getTotalItemCount(cart: Cart | undefined): number {
  if (!cart) return 0;
  const dishCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const ingredientCount = (cart.ingredientItems ?? []).reduce((sum, item) => sum + item.quantity, 0);
  return dishCount + ingredientCount;
}

// ⚠️ NOTE: For tax / fee calculations use `calcFinalTotalClient` from
// `@/utils/pricingClient` — it correctly mirrors the backend pricing logic.
// The taxRate from settings is already a decimal (e.g. 0.23 = 23%).
