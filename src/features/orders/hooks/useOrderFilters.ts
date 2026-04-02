import { useCallback, useMemo } from 'react';
import { useSearchParams, type NavigateOptions } from 'react-router-dom';
import type { OrdersQuery } from '@/shared/lib/api/order.api';
import { buildSearchParamsFromFilters, ORDER_FILTER_PARAM_KEYS, parseFiltersFromSearchParams } from '../utils/orderSearchParams';

type OrderFiltersUpdater = OrdersQuery | ((current: OrdersQuery) => OrdersQuery);

export function useOrderFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramsKey = searchParams.toString();

  const filters = useMemo(() => parseFiltersFromSearchParams(new URLSearchParams(paramsKey)), [paramsKey]);

  const setFilters = useCallback(
    (updater: OrderFiltersUpdater, options?: NavigateOptions) => {
      setSearchParams(currentParams => {
        const currentFilters = parseFiltersFromSearchParams(currentParams);
        const nextFilters = typeof updater === 'function' ? updater(currentFilters) : updater;
        const nextFilterParams = buildSearchParamsFromFilters(nextFilters);
        const mergedParams = new URLSearchParams(currentParams);

        for (const key of ORDER_FILTER_PARAM_KEYS) {
          mergedParams.delete(key);
        }

        nextFilterParams.forEach((value, key) => {
          mergedParams.set(key, value);
        });

        return mergedParams;
      }, options);
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(
    (options?: NavigateOptions) => {
      setFilters({}, options);
    },
    [setFilters],
  );

  return {
    filters,
    setFilters,
    resetFilters,
  };
}
