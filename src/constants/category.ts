import type { Category } from '@/types';

export const CATEGORY_LABEL: Record<Category, string> = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  BREAKFAST: '🌅',
  LUNCH: '☀️',
};

export const CATEGORY_BADGE_CLASS: Record<Category, string> = {
  BREAKFAST: 'bg-ob-caramel/12 text-ob-caramel',
  LUNCH: 'bg-ob-blue-deep/10 text-ob-blue-deep',
};
