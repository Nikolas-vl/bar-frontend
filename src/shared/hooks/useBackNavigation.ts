import { useCallback } from 'react';
import { useLocation, useNavigate, type To } from 'react-router-dom';

interface BackNavigationOptions {
  fallback?: string;
}

type EventLike = {
  preventDefault?: () => void;
};

function isEventLike(value: unknown): value is EventLike {
  return typeof value === 'object' && value !== null && 'preventDefault' in value;
}

function resolveFromState(state: unknown): To | undefined {
  if (!state || typeof state !== 'object') {
    return undefined;
  }

  const from = (state as { from?: unknown }).from;
  if (typeof from === 'string') {
    return from;
  }

  if (from && typeof from === 'object' && 'pathname' in from && typeof (from as { pathname?: unknown }).pathname === 'string') {
    const fromLocation = from as { pathname: string; search?: unknown; hash?: unknown };

    return {
      pathname: fromLocation.pathname,
      search: typeof fromLocation.search === 'string' ? fromLocation.search : '',
      hash: typeof fromLocation.hash === 'string' ? fromLocation.hash : '',
    };
  }

  return undefined;
}

function canNavigateBack(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const historyState = window.history.state as { idx?: unknown } | null;
  if (historyState && typeof historyState.idx === 'number') {
    return historyState.idx > 0;
  }

  return window.history.length > 1;
}

export function useBackNavigation(defaultOptions: BackNavigationOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (optionsOrEvent?: BackNavigationOptions | EventLike) => {
      if (isEventLike(optionsOrEvent)) {
        optionsOrEvent.preventDefault?.();
      }

      const options = isEventLike(optionsOrEvent) ? undefined : optionsOrEvent;
      const fallback = options?.fallback ?? defaultOptions.fallback;
      const from = resolveFromState(location.state);

      if (from) {
        navigate(from);
        return;
      }

      if (canNavigateBack()) {
        navigate(-1);
        return;
      }

      if (fallback) {
        navigate(fallback);
      }
    },
    [defaultOptions.fallback, location.state, navigate],
  );
}
