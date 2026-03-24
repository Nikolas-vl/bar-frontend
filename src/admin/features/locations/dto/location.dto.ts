export interface CreateLocationDto {
  name: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  isActive: boolean;
}

export type UpdateLocationDto = Partial<CreateLocationDto>;
