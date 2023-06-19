import { SortDirection } from '@angular/material/sort';

export interface TableData {
  keyword: string,
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  sort: string,
  order: SortDirection,
  page: number,
  size: number
}
