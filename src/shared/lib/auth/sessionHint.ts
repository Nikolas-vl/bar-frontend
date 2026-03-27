const SESSION_HINT_KEY = 'jolie_has_session';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const hasAuthSessionHint = (): boolean => {
  if (!canUseStorage()) return false;
  return window.localStorage.getItem(SESSION_HINT_KEY) === '1';
};

export const setAuthSessionHint = (): void => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(SESSION_HINT_KEY, '1');
};

export const clearAuthSessionHint = (): void => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(SESSION_HINT_KEY);
};
