import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { catchError, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
import { RoomType } from '../../../models/RoomType';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { RoomTypesService } from '../../../services/room-types.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonService } from '../../../services/common.service';
import { CuRoomTypeComponent } from '../cu-room-type/cu-room-type.component';
import { DialogComponent } from '../../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirm } from '../../../models/dialog-confirm';

@Component({
  selector: 'app-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.scss']
})
export class RoomTypesComponent implements OnInit, OnDestroy, AfterViewInit {
  timer: any;
  dataSource = new MatTableDataSource<RoomType>([]);
  displayedColumns: string[] = ['select', 'name', 'description', 'actions'];
  subscription = new Subscription();
  selections = new SelectionModel<RoomType>(true, []);
  searchValue = '';
  paginatorSizeOptions: number[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;

  constructor(public dialog: MatDialog, private roomTypesService: RoomTypesService, private commonService: CommonService) {
    this.paginatorSizeOptions = this.commonService.PaginatorOptions;

    this.subscription = this.roomTypesService.roomTypes$.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngOnInit() {
    this.commonService.Form = CuRoomTypeComponent;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.loadRoomTypes();
  }

  loadRoomTypes() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.roomTypesService.getRoomTypes(
            this.searchValue,
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

          this.resultsLength = data.total;
          return data.roomTypes;
        })
      )
      .subscribe(data => this.dataSource.data = data);
    this.selections.clear();
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
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.paginator.pageIndex = 0;
      this.loadRoomTypes();
    }, 500);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showCreatingForm() {
    this.commonService.FormData = { title: 'Thêm mới', action: 'create' };
  }

  showEditingForm(roomType: RoomType) {
    this.commonService.FormData = { title: 'Cập nhật', action: 'update', object: roomType };
  }

  onDelete(roomType: RoomType) {
    this.roomTypesService.delete(roomType.id).subscribe(() => {
      this.commonService.openSnackBar('Xoá thành công loại phòng ' + roomType.name);
      this.loadRoomTypes();
    });
  }

  onDeleteMany() {
    const roomTypeIds = this.selections.selected.map(roomType => roomType.id);
    this.roomTypesService.deleteMany(roomTypeIds).subscribe(() => {
      this.commonService.openSnackBar('Xoá thành công ' + roomTypeIds.length + ' loại phòng');
      this.loadRoomTypes();
    });
  }

  openDialog(data: DialogConfirm): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.action === 'delete') {
        this.onDelete(result.data);
      } else if (result.action === 'deleteMany') {
        this.onDeleteMany();
      }
    });
  }

  openDeleteManyDialog() {
    this.openDialog({
      title: 'Xác nhận xoá',
      message: 'Bạn có chắc chắn muốn xoá ' + this.selections.selected.length + ' loại phòng đã chọn?',
      action: 'deleteMany',
      data: null
    });
  }

  openDeleteDialog(roomType: RoomType) {
    this.openDialog({
      title: 'Xác nhận xoá',
      message: 'Bạn có chắc chắn muốn xoá loại phòng ' + roomType.name + '?',
      action: 'delete',
      data: roomType
    });
  }
}
