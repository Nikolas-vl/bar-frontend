import { CATEGORY_VALUES } from '@/shared/constants/category';
import type { Category, DishQuery } from '@/shared/types';

const SORT_BY_VALUES = ['name', 'price', 'calories', 'protein', 'fat', 'carbs'] as const;
const SORT_ORDER_VALUES = ['asc', 'desc'] as const;

const CATEGORY_SET = new Set<string>(CATEGORY_VALUES);
const SORT_BY_SET = new Set<string>(SORT_BY_VALUES);
const SORT_ORDER_SET = new Set<string>(SORT_ORDER_VALUES);

const MENU_FILTER_PARAM_ORDER = ['category', 'minCalories', 'maxCalories', 'search', 'sorting'] as const;

export const MENU_FILTER_PARAM_KEYS = [...MENU_FILTER_PARAM_ORDER, 'sortBy', 'sortOrder'] as const;

function toValidCategory(value: string | null | undefined): Category | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.toUpperCase();
  if (!CATEGORY_SET.has(normalized)) {
    return undefined;
  }

  return normalized as Category;
}

function toValidSortBy(value: string | null | undefined): DishQuery['sortBy'] | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.toLowerCase();
  if (!SORT_BY_SET.has(normalized)) {
    return undefined;
  }

  return normalized as DishQuery['sortBy'];
}

function toValidSortOrder(value: string | null | undefined): DishQuery['sortOrder'] | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.toLowerCase();
  if (!SORT_ORDER_SET.has(normalized)) {
    return undefined;
  }

  return normalized as DishQuery['sortOrder'];
}

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

function normalizeSearch(value: string | null | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function parseSorting(params: URLSearchParams): Pick<DishQuery, 'sortBy' | 'sortOrder'> {
  const sortingParam = params.get('sorting');

  if (sortingParam) {
    const [sortByRaw, sortOrderRaw] = sortingParam.split(':');
    const sortBy = toValidSortBy(sortByRaw);

    if (sortBy) {
      return {
        sortBy,
        sortOrder: toValidSortOrder(sortOrderRaw) ?? 'asc',
      };
    }
  }

  const legacySortBy = toValidSortBy(params.get('sortBy'));
  if (legacySortBy) {
    return {
      sortBy: legacySortBy,
      sortOrder: toValidSortOrder(params.get('sortOrder')) ?? 'asc',
    };
  }

  return {};
}

function buildSorting(sortBy: DishQuery['sortBy'], sortOrder: DishQuery['sortOrder']): string | undefined {
  const normalizedSortBy = toValidSortBy(sortBy);
  if (!normalizedSortBy) {
    return undefined;
  }

  const normalizedSortOrder = toValidSortOrder(sortOrder) ?? 'asc';
  return `${normalizedSortBy}:${normalizedSortOrder}`;
}

export function parseFiltersFromSearchParams(params: URLSearchParams): DishQuery {
  const category = toValidCategory(params.get('category'));
  const minCalories = parsePositiveInt(params.get('minCalories'));
  const maxCalories = parsePositiveInt(params.get('maxCalories'));
  const search = normalizeSearch(params.get('search'));
  const { sortBy, sortOrder } = parseSorting(params);

  const filters: DishQuery = {};

  if (category) {
    filters.category = category;
  }

  if (minCalories !== undefined) {
    filters.minCalories = minCalories;
  }

  if (maxCalories !== undefined) {
    filters.maxCalories = maxCalories;
  }

  if (search) {
    filters.search = search;
  }

  if (sortBy) {
    filters.sortBy = sortBy;
    filters.sortOrder = sortOrder;
  }

  return filters;
}

export function buildSearchParamsFromFilters(filters: DishQuery): URLSearchParams {
  const params = new URLSearchParams();
  const normalizedCategory = toValidCategory(filters.category);
  const normalizedMinCalories = toPositiveInt(filters.minCalories);
  const normalizedMaxCalories = toPositiveInt(filters.maxCalories);
  const normalizedSearch = normalizeSearch(filters.search);
  const sorting = buildSorting(filters.sortBy, filters.sortOrder);

  if (normalizedCategory) {
    params.set('category', normalizedCategory);
  }

  if (normalizedMinCalories !== undefined) {
    params.set('minCalories', String(normalizedMinCalories));
  }

  if (normalizedMaxCalories !== undefined) {
    params.set('maxCalories', String(normalizedMaxCalories));
  }

  if (normalizedSearch) {
    params.set('search', normalizedSearch);
  }

  if (sorting) {
    params.set('sorting', sorting);
  }

  return params;
}
