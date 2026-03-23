export interface CreateReservationDto {
  userId: number;
  date: string;
  guests: number;
  tableId?: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED';
  comment?: string;
}

export type UpdateReservationDto = Partial<CreateReservationDto>;
