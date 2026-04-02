export const CATEGORY_CONFIG = {
  BREAKFAST: { label: 'Breakfast', emoji: '🌅', badgeClass: 'bg-ob-caramel/12 text-ob-caramel' },
  LUNCH: { label: 'Lunch', emoji: '☀️', badgeClass: 'bg-ob-blue-deep/10 text-ob-blue-deep' },
} as const;

export type CategoryValue = keyof typeof CATEGORY_CONFIG;

export const CATEGORY_VALUES = ['BREAKFAST', 'LUNCH'] as const satisfies readonly CategoryValue[];

export const CATEGORY_LABEL = Object.fromEntries(CATEGORY_VALUES.map(value => [value, CATEGORY_CONFIG[value].label])) as Record<
  CategoryValue,
  string
>;

export const CATEGORY_EMOJI = Object.fromEntries(CATEGORY_VALUES.map(value => [value, CATEGORY_CONFIG[value].emoji])) as Record<
  CategoryValue,
  string
>;

export const CATEGORY_BADGE_CLASS = Object.fromEntries(CATEGORY_VALUES.map(value => [value, CATEGORY_CONFIG[value].badgeClass])) as Record<
  CategoryValue,
  string
>;

export const CATEGORY_FILTER_OPTIONS = ['ALL', ...CATEGORY_VALUES] as const;
export type CategoryFilterValue = (typeof CATEGORY_FILTER_OPTIONS)[number];

export const CATEGORY_FILTER_LABEL = {
  ALL: 'All',
  ...CATEGORY_LABEL,
} as const satisfies Record<CategoryFilterValue, string>;

export const CATEGORY_SELECT_OPTIONS = CATEGORY_VALUES.map(value => ({
  value,
  label: CATEGORY_CONFIG[value].label,
}));

export const CATEGORY_FILTER_SELECT_OPTIONS = CATEGORY_FILTER_OPTIONS.map(value => ({
  value,
  label: CATEGORY_FILTER_LABEL[value],
}));

// Backward-compatible alias used by some existing filters.
export const CATEGORY_OPTIONS = [{ value: undefined, label: 'All' }, ...CATEGORY_SELECT_OPTIONS];

export const MENU_SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'name:asc', label: 'Name A-Z' },
  { value: 'name:desc', label: 'Name Z-A' },
  { value: 'price:asc', label: 'Price ↑' },
  { value: 'price:desc', label: 'Price ↓' },
  { value: 'calories:asc', label: 'Calories ↑' },
  { value: 'calories:desc', label: 'Calories ↓' },
];

export const CALORIE_PRESETS = [
  { label: 'Any', min: undefined, max: undefined },
  { label: '< 300 kcal', max: 300 },
  { label: '300-600', min: 300, max: 600 },
  { label: '600-900', min: 600, max: 900 },
  { label: '900+ kcal', min: 900 },
];
