import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonService } from '../../../services/common.service';
import { CuRoomComponent } from '../cu-room/cu-room.component';
import { RoomsService } from '../../../services/rooms.service';
import { RoomDTO } from '../../../models/RoomDTO';
import { Room } from '../../../models/Room';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, AfterViewInit, OnDestroy {
  dataSource = new MatTableDataSource<RoomDTO>([]);
  displayedColumns: string[] = ['select', 'name', 'description', 'actions'];
  subscription = new Subscription();
  selections = new SelectionModel<RoomDTO>(true, []);
  searchValue = '';
  paginatorSizeOptions: number[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;

  constructor(private roomService: RoomsService, private commonService: CommonService) {
    this.paginatorSizeOptions = this.commonService.PaginatorOptions;

    this.subscription = this.roomService.rooms$.subscribe(data => {
      this.dataSource.data = data;
      console.log(data);
    });
  }

  ngOnInit() {
    this.commonService.Form = CuRoomComponent;
  }

  ngAfterViewInit() {
    this.loadRoomTypes();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  loadRoomTypes() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.roomService.getRooms(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize
          ).pipe(catchError(() => of(null)));
        }),
        map(data => {
          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = data.length;
          return data;
        })
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

  showCreatingForm() {
    this.commonService.FormData = { title: 'Thêm mới', action: 'create' };
  }

  showEditingForm(room: Room) {
    this.commonService.FormData = { title: 'Cập nhật', action: 'update', object: room };
  }

  onDelete(room: Room) {
    this.roomService.delete(room._id).subscribe(() => {
      this.loadRoomTypes();
    });
  }
}
