// ─── Auth ──────────────────────────────────────────────────────────────────

export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

// ─── Common ────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  issues?: { path: string[]; message: string }[];
}

// ─── Menu ──────────────────────────────────────────────────────────────────

export type Category = 'BREAKFAST' | 'LUNCH';

export interface Ingredient {
  id: number;
  name: string;
  price: string;
}

export interface DishIngredient {
  ingredientId: number;
  quantity: number;
  optional: boolean;
  ingredient: Ingredient;
}

export interface Dish {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  category: Category;
  isAvailable: boolean;
  ingredients: DishIngredient[];
}

export interface DishQuery {
  search?: string;
  category?: Category;
  minPrice?: number;
  maxPrice?: number;
  minCalories?: number;
  maxCalories?: number;
  isAvailable?: boolean;
  sortBy?: 'name' | 'price' | 'calories' | 'protein' | 'fat' | 'carbs';
  sortOrder?: 'asc' | 'desc';
}

// ─── Cart ──────────────────────────────────────────────────────────────────

export interface CartItemExtra {
  id: number;
  ingredientId: number;
  quantity: number;
  note: string | null;
  ingredient: Ingredient;
}

export interface CartItem {
  id: number;
  dishId: number;
  quantity: number;
  note: string | null;
  dish: Dish;
  extras: CartItemExtra[];
}

export interface CartIngredientItem {
  id: number;
  ingredientId: number;
  quantity: number;
  note: string | null;
  ingredient: Ingredient;
}

export interface Cart {
  id: number;
  items: CartItem[];
  ingredientItems: CartIngredientItem[];
}

// ─── Orders ────────────────────────────────────────────────────────────────

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

// ─── Reservations ──────────────────────────────────────────────────────────

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

// ─── Payments ──────────────────────────────────────────────────────────────

export interface PaymentMethod {
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
  createdAt: string;
  type: PaymentType;
}

// ─── Address ───────────────────────────────────────────────────────────────

export interface Address {
  id: number;
  city: string;
  street: string;
  zip: string;
  phone: string;
}

// ─── Settings ──────────────────────────────────────────────────────────────

export interface Settings {
  id: number;
  restaurantName: string;
  taxRate: string;
  deliveryFee: string;
  serviceFee: string;
  freeDeliveryThreshold: string;
}
