import type { Settings } from '@/shared/types/settings.types';
import type { UpdateSettingsDto } from '../dto/settings.dto';
import type { RestaurantInfoFormOutput, PricingFormOutput } from '../schemas/settings.schema';

export const mapSettingsToInfoForm = (settings: Settings): RestaurantInfoFormOutput => ({
  restaurantName: settings.restaurantName,
});

export const mapSettingsToPricingForm = (settings: Settings): PricingFormOutput => ({
  taxRate: parseFloat(settings.taxRate) * 100,
  deliveryFee: parseFloat(settings.deliveryFee),
  serviceFee: parseFloat(settings.serviceFee),
  freeDeliveryThreshold: parseFloat(settings.freeDeliveryThreshold),
});

export const mapInfoFormToDto = (formData: RestaurantInfoFormOutput): UpdateSettingsDto => ({
  restaurantName: formData.restaurantName,
});

export const mapPricingFormToDto = (formData: PricingFormOutput): UpdateSettingsDto => ({
  taxRate: formData.taxRate / 100,
  deliveryFee: formData.deliveryFee,
  serviceFee: formData.serviceFee,
  freeDeliveryThreshold: formData.freeDeliveryThreshold,
});
