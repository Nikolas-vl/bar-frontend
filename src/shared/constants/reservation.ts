export const RESERVATION_STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'gray', badgeClass: 'badge-pending' },
  CONFIRMED: { label: 'Confirmed', color: 'blue', badgeClass: 'badge-confirmed' },
  CANCELED: { label: 'Canceled', color: 'red', badgeClass: 'badge-canceled' },
} as const;

export const RESERVATION_STATUS_VALUES = ['PENDING', 'CONFIRMED', 'CANCELED'] as const;

export const RESERVATION_STATUS_SELECT_OPTIONS = RESERVATION_STATUS_VALUES.map(value => ({
  value,
  label: RESERVATION_STATUS_CONFIG[value].label,
}));

export const RESERVATION_STATUS_FILTER_OPTIONS = ['ALL', ...RESERVATION_STATUS_VALUES] as const;
export type ReservationStatusFilterValue = (typeof RESERVATION_STATUS_FILTER_OPTIONS)[number];

export const RESERVATION_STATUS_FILTER_LABEL = {
  ALL: 'All',
  PENDING: RESERVATION_STATUS_CONFIG.PENDING.label,
  CONFIRMED: RESERVATION_STATUS_CONFIG.CONFIRMED.label,
  CANCELED: RESERVATION_STATUS_CONFIG.CANCELED.label,
} as const satisfies Record<ReservationStatusFilterValue, string>;
