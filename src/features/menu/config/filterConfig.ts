import type { Category } from '../../../types/index';

export const categories: { value: Category | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'LUNCH', label: 'Lunch' },
];

export const sortOptions: { value: string; label: string }[] = [
  { value: '', label: 'Default' },
  { value: 'name:asc', label: 'Name A-Z' },
  { value: 'name:desc', label: 'Name Z-A' },
  { value: 'price:asc', label: 'Price ↑' },
  { value: 'price:desc', label: 'Price ↓' },
  { value: 'calories:asc', label: 'Calories ↑' },
  { value: 'calories:desc', label: 'Calories ↓' },
];

export const caloriePresets: { label: string; min?: number; max?: number }[] = [
  { label: 'Any', min: undefined, max: undefined },
  { label: '< 300 kcal', max: 300 },
  { label: '300-600', min: 300, max: 600 },
  { label: '600-900', min: 600, max: 900 },
  { label: '900+ kcal', min: 900 },
];
