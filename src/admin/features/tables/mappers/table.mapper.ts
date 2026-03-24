import type { Table } from '@/shared/types/reservation.types';
import type { CreateTableDto } from '../dto/table.dto';
import type { TableFormOutput } from '../schemas/table.schema';

export const mapTableToForm = (table: Table): TableFormOutput => ({
  number: table.number,
  capacity: table.capacity,
  locationId: table.locationId,
});

export const mapTableFormToDto = (formData: TableFormOutput): CreateTableDto => ({
  number: formData.number,
  capacity: formData.capacity,
  locationId: formData.locationId,
});
