import type { Cart } from '@/types';

/** Returns cart items whose dish is currently unavailable */
export function getUnavailableItems(cart: Cart | undefined) {
  if (!cart) return [];
  return cart.items.filter(item => !item.dish.isAvailable);
}

export function hasUnavailableItems(cart: Cart | undefined): boolean {
  return getUnavailableItems(cart).length > 0;
}
