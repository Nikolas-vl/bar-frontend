import type { Location } from '@/shared/types/reservation.types';
import type { CreateLocationDto } from '../dto/location.dto';
import type { LocationFormOutput } from '../schemas/location.schema';

export const mapLocationToForm = (location: Location): LocationFormOutput => ({
  name: location.name,
  address: location.address,
  phone: location.phone,
  email: location.email,
  openingHours: location.openingHours,
  isActive: location.isActive,
});

export const mapLocationFormToDto = (formData: LocationFormOutput): CreateLocationDto => ({
  name: formData.name,
  address: formData.address,
  phone: formData.phone,
  email: formData.email,
  openingHours: formData.openingHours,
  isActive: formData.isActive,
});
