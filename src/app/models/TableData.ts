import { SortDirection } from '@angular/material/sort';

export interface TableData {
  keyword: string,
  sort: string,
  order: SortDirection,
  page: number,
  size: number
}
