export interface CreateTableDto {
  number: number;
  capacity: number;
  locationId: number;
}

export type UpdateTableDto = Partial<CreateTableDto>;
