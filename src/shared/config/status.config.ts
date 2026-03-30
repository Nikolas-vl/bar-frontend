export { ORDER_STATUS_CONFIG } from '@/shared/constants/order';
export type OrderStatus = keyof typeof import('@/shared/constants/order').ORDER_STATUS_CONFIG;

export { PAYMENT_STATUS_CONFIG } from '@/shared/constants/payment';
export type PaymentStatus = keyof typeof import('@/shared/constants/payment').PAYMENT_STATUS_CONFIG;

export { RESERVATION_STATUS_CONFIG } from '@/shared/constants/reservation';
export type ReservationStatus = keyof typeof import('@/shared/constants/reservation').RESERVATION_STATUS_CONFIG;
