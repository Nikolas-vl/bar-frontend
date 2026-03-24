import type { Dish } from './menu.types';

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'CANCELED';

export interface Location {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  isActive: boolean;
}

export interface Table {
  id: number;
  number: number;
  capacity: number;
  locationId: number;
  location: Location;
}

export interface ReservationPreOrder {
  id: number;
  dishId: number;
  quantity: number;
  dish: Dish;
}

export interface Reservation {
  id: number;
  userId: number;
  tableId: number | null;
  date: string;
  guests: number;
  status: ReservationStatus;
  comment: string | null;
  table: Table | null;
  preOrders: ReservationPreOrder[];
  createdAt: string;
}

export interface PaginatedReservations {
  reservations: Reservation[];
  total: number;
  page: number;
  limit: number;
}
