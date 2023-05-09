import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { catchError, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
import { RoomType } from '../../../models/RoomType';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { RoomTypesService } from '../../../services/room-types.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.scss']
})
export class RoomTypesComponent implements OnDestroy, AfterViewInit {
  dataSource!: MatTableDataSource<RoomType>;
  displayedColumns: string[] = ['select', 'name', 'description', 'actions'];
  subscription = new Subscription();
  selections = new SelectionModel<RoomType>(true, []);
  searchValue: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  constructor(private roomTypesService: RoomTypesService) {
    this.dataSource = new MatTableDataSource<RoomType>([]);
  }

  ngAfterViewInit() {
    this.loadRoomTypes();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadRoomTypes() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.roomTypesService.getRoomTypes(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
          ).pipe(catchError(() => of(null)));
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.length;
          return data;
        }),
      )
      .subscribe(data => {
        return this.dataSource.data = data;
      });
  }

  isAllSelected() {
    const numSelected = this.selections.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selections.clear();
      return;
    }

    this.selections.select(...this.dataSource.data);
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
