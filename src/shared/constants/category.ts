

export const CATEGORY_CONFIG = {
  BREAKFAST: { label: 'Breakfast', emoji: '🌅', badgeClass: 'bg-ob-caramel/12 text-ob-caramel' },
  LUNCH: { label: 'Lunch', emoji: '☀️', badgeClass: 'bg-ob-blue-deep/10 text-ob-blue-deep' },
} as const;

export const CATEGORY_OPTIONS = [
  { value: undefined, label: 'All' },
  ...Object.entries(CATEGORY_CONFIG).map(([value, { label }]) => ({
    value,
    label,
  })),
];

export const MENU_SORT_OPTIONS = [
  { value: '', label: 'Default' },
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
