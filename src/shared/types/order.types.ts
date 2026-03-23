import type { Dish, Ingredient } from './menu.types';
import type { Address } from './address.types';

export type OrderType = 'DINE_IN' | 'DELIVERY' | 'TAKE_OUT';
export type OrderStatus = 'NEW' | 'PAID' | 'PREPARING' | 'COMPLETED' | 'CANCELED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';
export type PaymentType = 'CARD' | 'CASH' | 'BLIK';

export interface OrderItemExtra {
  id: number;
  ingredientId: number;
  quantity: number;
  ingredient: Ingredient;
}

export interface OrderItem {
  id: number;
  dishId: number;
  quantity: number;
  note: string | null;
  dish: Dish;
  extras: OrderItemExtra[];
}

export interface OrderIngredientItem {
  id: number;
  ingredientId: number;
  quantity: number;
  note: string | null;
  ingredient: Ingredient;
}

export interface PaymentMethodSummary {
  id: number;
  cardType: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

export interface Payment {
  id: number;
  orderId: number;
  userId: number;
  amount: string;
  status: PaymentStatus;
  paymentMethodId: number | null;
  paymentMethod: PaymentMethodSummary | null;
  createdAt: string;
  type: PaymentType;
}

export interface Order {
  id: number;
  userId: number;
  type: OrderType;
  status: OrderStatus;
  subtotal: string;
  discount: string;
  tax: string;
  deliveryFee: string;
  serviceFee: string;
  total: string;
  paymentStatus: PaymentStatus;
  comment: string | null;
  createdAt: string;
  address: Address | null;
  items: OrderItem[];
  ingredientItems: OrderIngredientItem[];
  payments: Payment[];
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}
