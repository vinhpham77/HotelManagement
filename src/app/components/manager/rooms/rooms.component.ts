import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { catchError, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonService } from '../../../services/common.service';
import { CuRoomComponent } from '../cu-room/cu-room.component';
import { RoomsService } from '../../../services/rooms.service';
import { RoomDto } from '../../../models/RoomDto';
import { Room } from '../../../models/Room';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirm } from '../../../models/dialog-confirm';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, AfterViewInit, OnDestroy {
  timer: any;
  dataSource: RoomDto[] = [];
  displayedColumns: string[] = ['select', 'roomName', 'roomTypeName', 'pricePerDay', 'isEmpty', 'isCleaned', 'lastCleanedAt', 'roomDescription', 'maxAdult', 'maxChild', 'actions'];
  subscription = new Subscription();
  selections = new SelectionModel<RoomDto>(true, []);
  searchValue = '';
  paginatorSizeOptions: number[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;

  constructor(public dialog: MatDialog, private roomsService: RoomsService, private commonService: CommonService) {
    this.paginatorSizeOptions = this.commonService.PaginatorOptions;

    this.subscription = this.roomsService.roomsDtos$.subscribe(data => {
      this.dataSource = data;
    });
  }

  ngOnInit() {
    this.commonService.Form = CuRoomComponent;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.loadRoomDtos();
  }

  loadRoomDtos() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.roomsService.getRoomDtos(
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
          return data.items;
        })
      )
      .subscribe(data => this.dataSource = data);
    this.selections.clear();
  }

  isAllSelected() {
    const numSelected = this.selections.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selections.clear();
      return;
    }

    this.selections.select(...this.dataSource);
  }

  applyFilter() {
    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.paginator.pageIndex = 0;
      this.loadRoomDtos();
    }, 500);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showCreatingForm() {
    this.commonService.FormData = { title: 'Thêm mới', action: 'create' };
  }

  showEditingForm(roomDto: RoomDto) {
    const room = <Room> {
      id: roomDto.id,
      name: roomDto.name,
      roomTypeId: roomDto.roomTypeId,
      pricePerDay: roomDto.pricePerDay,
      isEmpty: roomDto.isEmpty,
      isCleaned: roomDto.isCleaned,
      lastCleanedAt: roomDto.lastCleanedAt,
      description: roomDto.description,
      maxAdult: roomDto.maxAdult,
      maxChild: roomDto.maxChild
    }
    this.commonService.FormData = { title: 'Cập nhật', action: 'update', object: room };
  }

  onDelete(roomDto: RoomDto) {
    this.roomsService.delete(roomDto.id).subscribe(() => {
      this.refreshOnSuccess('Xoá thành công phòng ' + roomDto.name);
    });
  }

  onDeleteMany() {
    const roomDtoIds = this.selections.selected.map(menuItem => menuItem.id);
    this.roomsService.deleteMany(roomDtoIds).subscribe(() => {
      this.refreshOnSuccess('Xoá thành công ' + roomDtoIds.length + ' phòng');
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
      message: 'Bạn có chắc chắn muốn xoá ' + this.selections.selected.length + ' phòng đã chọn?',
      action: 'deleteMany',
      data: null
    });
  }

  openDeleteDialog(roomDto: RoomDto) {
    this.openDialog({
      title: 'Xác nhận xoá',
      message: 'Bạn có chắc chắn muốn xoá ' + roomDto.name + '?',
      action: 'delete',
      data: roomDto
    });
  }

  refreshOnSuccess(msg: string) {
    this.loadRoomDtos();
    this.commonService.openSnackBar(msg);
  }
}
