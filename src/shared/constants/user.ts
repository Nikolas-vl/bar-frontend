export const ROLE_CONFIG = {
  USER: { label: 'User', badgeClass: 'bg-ob-blue text-ob-text' },
  ADMIN: { label: 'Administrator', badgeClass: 'bg-ob-caramel/15 text-ob-caramel' },
} as const;

export const ROLE_VALUES = ['USER', 'ADMIN'] as const;

export const ROLE_FILTER_OPTIONS = ['ALL', ...ROLE_VALUES] as const;
export type RoleFilterValue = (typeof ROLE_FILTER_OPTIONS)[number];

export const ROLE_FILTER_LABEL = {
  ALL: 'All',
  USER: ROLE_CONFIG.USER.label,
  ADMIN: ROLE_CONFIG.ADMIN.label,
} as const satisfies Record<RoleFilterValue, string>;
