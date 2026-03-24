import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatPrice = (price: string | number) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(Number(price));

export const formatDate = (date: string | Date) =>
  new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));

export const formatDateShort = (date: string | Date) => new Intl.DateTimeFormat('pl-PL', { dateStyle: 'medium' }).format(new Date(date));
