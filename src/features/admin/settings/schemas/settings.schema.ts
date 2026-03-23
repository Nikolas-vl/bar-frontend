import { z } from 'zod';

export const restaurantInfoSchema = z.object({
  restaurantName: z.string().min(1, 'Restaurant name is required'),
});

export const pricingSchema = z.object({
  taxRate: z.coerce.number().min(0).max(100, 'Must be 0–100'),
  deliveryFee: z.coerce.number().min(0),
  serviceFee: z.coerce.number().min(0),
  freeDeliveryThreshold: z.coerce.number().min(0),
});

export type RestaurantInfoFormInput = z.input<typeof restaurantInfoSchema>;
export type RestaurantInfoFormOutput = z.output<typeof restaurantInfoSchema>;

export type PricingFormInput = z.input<typeof pricingSchema>;
export type PricingFormOutput = z.output<typeof pricingSchema>;
