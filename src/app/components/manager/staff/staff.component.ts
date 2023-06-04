import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { catchError, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { DialogConfirm } from '../../../models/dialog-confirm';
import { DialogComponent } from '../../dialog/dialog.component';
import { Personnel } from '../../../models/Personnel';
import { CuPersonnelComponent } from '../cu-personnel/cu-personnel.component';
import { StaffService } from '../../../services/staff.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss']
})
export class StaffComponent implements OnInit, AfterViewInit, OnDestroy {
  timer: any;
  dataSource: Personnel[] = [];
  displayedColumns: string[] = ['select', 'fullName', 'username', 'birthdate', 'sex', 'idNo', 'phoneNumber', 'address', 'nationality', 'actions'];
  subscription = new Subscription();
  selections = new SelectionModel<Personnel>(true, []);
  searchValue = '';
  paginatorSizeOptions: number[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;

  constructor(public dialog: MatDialog, private staffService: StaffService, private commonService: CommonService) {
    this.paginatorSizeOptions = this.commonService.PaginatorOptions;

    this.subscription = this.staffService.staff$.subscribe(data => {
      this.dataSource = data;
    });
  }

  ngOnInit() {
    this.commonService.Form = CuPersonnelComponent;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.loadStaff();
  }

  loadStaff() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.staffService.getStaff(
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
      this.loadStaff();
    }, 500);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showCreatingForm() {
    this.commonService.FormData = { title: 'Thêm mới', action: 'create' };
  }

  showEditingForm(personnel: Personnel) {
    this.commonService.FormData = { title: 'Cập nhật', action: 'update', object: personnel };
  }

  onDelete(personnel: Personnel) {
    this.staffService.delete(personnel.id).subscribe(() => {
      this.refreshOnSuccess('Xoá thành công nhân sự ' + personnel.fullName);
    });
  }

  onDeleteMany() {
    const personnelIds = this.selections.selected.map(personnel => personnel.id);
    this.staffService.deleteMany(personnelIds).subscribe(() => {
      this.refreshOnSuccess('Xoá thành công ' + personnelIds.length + ' nhân sự');
    });
  }

  refreshOnSuccess(msg: string) {
    this.loadStaff();
    this.commonService.openSnackBar(msg);
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
      message: 'Bạn có chắc chắn muốn xoá ' + this.selections.selected.length + ' nhân sự đã chọn?',
      action: 'deleteMany',
      data: null
    });
  }

  openDeleteDialog(personnel: Personnel) {
    this.openDialog({
      title: 'Xác nhận xoá',
      message: 'Bạn có chắc chắn muốn xoá nhân sự ' + personnel.fullName + '?',
      action: 'delete',
      data: personnel
    });
  }
}
