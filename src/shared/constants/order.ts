export const ORDER_STATUS_CONFIG = {
  NEW: { label: 'New', color: 'gray', badgeClass: 'badge-new' },
  PAID: { label: 'Paid', color: 'blue', badgeClass: 'badge-paid' },
  PREPARING: { label: 'Preparing', color: 'orange', badgeClass: 'badge-preparing' },
  COMPLETED: { label: 'Completed', color: 'green', badgeClass: 'badge-completed' },
  CANCELED: { label: 'Canceled', color: 'red', badgeClass: 'badge-canceled' },
} as const;

export const ORDER_STATUS_VALUES = ['NEW', 'PAID', 'PREPARING', 'COMPLETED', 'CANCELED'] as const;

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];

export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  NEW: ['PAID', 'CANCELED'],
  PAID: ['PREPARING', 'CANCELED'],
  PREPARING: ['COMPLETED', 'CANCELED'],
  COMPLETED: [],
  CANCELED: [],
};

export const ORDER_CANCELABLE_STATUSES = ['NEW', 'PAID', 'PREPARING'] as const satisfies readonly OrderStatus[];

export function isOrderCancelableStatus(status: OrderStatus): boolean {
  return ORDER_CANCELABLE_STATUSES.includes(status as (typeof ORDER_CANCELABLE_STATUSES)[number]);
}

export const ORDER_STATUS_FILTER_OPTIONS = ['ALL', ...ORDER_STATUS_VALUES] as const;
export type OrderStatusFilterValue = (typeof ORDER_STATUS_FILTER_OPTIONS)[number];

export const ORDER_STATUS_FILTER_LABEL = {
  ALL: 'All',
  NEW: ORDER_STATUS_CONFIG.NEW.label,
  PAID: ORDER_STATUS_CONFIG.PAID.label,
  PREPARING: ORDER_STATUS_CONFIG.PREPARING.label,
  COMPLETED: ORDER_STATUS_CONFIG.COMPLETED.label,
  CANCELED: ORDER_STATUS_CONFIG.CANCELED.label,
} as const satisfies Record<OrderStatusFilterValue, string>;

export const ORDER_STATUS_FILTER_ITEMS: ReadonlyArray<{
  option: OrderStatusFilterValue;
  label: string;
  value: OrderStatus | undefined;
}> = ORDER_STATUS_FILTER_OPTIONS.map(option => ({
  option,
  label: ORDER_STATUS_FILTER_LABEL[option],
  value: option === 'ALL' ? undefined : option,
}));

export const ORDER_TYPE_CONFIG = {
  DINE_IN: { label: 'Dine In', icon: '🍽️', description: 'Eat at the restaurant' },
  DELIVERY: { label: 'Delivery', icon: '🛵', description: 'Delivered to your door' },
  TAKE_OUT: { label: 'Take Out', icon: '🥡', description: 'Pick up your order' },
} as const;

export const ORDER_TYPE_VALUES = ['DINE_IN', 'TAKE_OUT', 'DELIVERY'] as const;

export type OrderType = (typeof ORDER_TYPE_VALUES)[number];

export const ORDER_TYPE_OPTIONS = ORDER_TYPE_VALUES.map(value => ({
  value,
  ...ORDER_TYPE_CONFIG[value],
}));
