import { ORDER_STATUS_VALUES } from '@/shared/constants/order';
import type { OrdersQuery } from '@/shared/lib/api/order.api';

const ORDER_STATUS_SET = new Set<string>(ORDER_STATUS_VALUES);

export const DEFAULT_ORDERS_LIMIT = 20;

export const ORDER_FILTER_PARAM_KEYS = ['status', 'page', 'limit'] as const;

function parsePositiveInt(value: string | null | undefined): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return undefined;
  }

  return parsed;
}

function toPositiveInt(value: number | null | undefined): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (!Number.isInteger(value) || value <= 0) {
    return undefined;
  }

  return value;
}

function toValidStatus(value: string | null | undefined): OrdersQuery['status'] | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.toUpperCase();
  if (!ORDER_STATUS_SET.has(normalized)) {
    return undefined;
  }

  return normalized;
}

export function parseFiltersFromSearchParams(params: URLSearchParams): OrdersQuery {
  const status = toValidStatus(params.get('status'));
  const page = parsePositiveInt(params.get('page'));
  const limit = parsePositiveInt(params.get('limit')) ?? DEFAULT_ORDERS_LIMIT;

  const filters: OrdersQuery = { limit };

  if (status) {
    filters.status = status;
  }

  if (page !== undefined) {
    filters.page = page;
  }

  return filters;
}

export function buildSearchParamsFromFilters(filters: OrdersQuery): URLSearchParams {
  const params = new URLSearchParams();
  const status = toValidStatus(filters.status);
  const page = toPositiveInt(filters.page);
  const limit = toPositiveInt(filters.limit);

  if (status) {
    params.set('status', status);
  }

  if (page !== undefined) {
    params.set('page', String(page));
  }

  if (limit !== undefined) {
    params.set('limit', String(limit));
  }

  return params;
}
