import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ReceiptDto } from '../../../models/ReceiptDto';
import { catchError, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { DialogConfirm } from '../../../models/dialog-confirm';
import { DialogComponent } from '../../dialog/dialog.component';
import { UpdateReceiptComponent } from '../update-receipt/update-receipt.component';
import { ReceiptDtosService } from '../../../services/receipt-dtos.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

const now = new Date();
now.setDate(now.getDate() - 18);
const lastWeek = new Date();
lastWeek.setDate(now.getDate() - 54);

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.scss']
})
export class ReceiptsComponent implements OnInit, AfterViewInit, OnDestroy {
  timer: any;
  dataSource: ReceiptDto[] = [];
  displayedColumns: string[] = ['select', 'room.name', 'customer.fullName', 'personnel.fullName', 'reservationDetail.checkedInAt', 'reservationDetail.checkedOutAt', 'roomPrice', 'createdAt', 'actions'];
  subscription = new Subscription();
  selections = new SelectionModel<ReceiptDto>(true, []);
  searchValue = '';
  paginatorSizeOptions: number[];

  range = new FormGroup({
    start: new FormControl<Date | null>(lastWeek, Validators.required),
    end: new FormControl<Date | null>(now, Validators.required)
  });

  get Start() {
    return this.range.get('start')?.value;
  }

  get End() {
    return this.range.get('end')?.value;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;

  constructor(public dialog: MatDialog, private receiptDtosService: ReceiptDtosService, private commonService: CommonService) {
    this.paginatorSizeOptions = this.commonService.PaginatorOptions;

    this.subscription = this.receiptDtosService.receiptDtos$.subscribe(data => {
      this.dataSource = data;
      this.selections.clear();
    });
  }

  ngOnInit() {
    this.commonService.Form = UpdateReceiptComponent;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.loadReceiptDtos();
  }

  loadReceiptDtos() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.receiptDtosService.getReceiptDtos(
            this.searchValue,
            this.Start?.toISOString(),
            this.End?.toISOString(),
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
      this.loadReceiptDtos();
    }, 500);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showCreatingForm() {
    this.commonService.FormData = { title: 'Thêm mới', action: 'create' };
  }

  showEditingForm(receiptDto: ReceiptDto) {
    this.commonService.FormData = { title: 'Cập nhật', action: 'update', object: receiptDto };
  }

  onDelete(receiptDto: ReceiptDto) {
    this.receiptDtosService.delete(receiptDto.id).subscribe(() => {
      this.refreshOnSuccess('Xoá thành công hoá đơn');
    });
  }

  onDeleteMany() {
    const receiptIds = this.selections.selected.map(receiptDto => receiptDto.id);
    this.receiptDtosService.deleteMany(receiptIds).subscribe(() => {
      this.refreshOnSuccess('Xoá thành công ' + receiptIds.length + ' hoá đơn');
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
      message: 'Bạn có chắc chắn muốn xoá ' + this.selections.selected.length + ' hoá đơn đã chọn?',
      action: 'deleteMany',
      data: null
    });
  }

  openDeleteDialog(receiptDto: ReceiptDto) {
    this.openDialog({
      title: 'Xác nhận xoá',
      message: 'Bạn có chắc chắn muốn xoá hoá đơn này không?',
      action: 'delete',
      data: receiptDto
    });
  }

  refreshOnSuccess(msg: string) {
    this.loadReceiptDtos();
    this.commonService.openSnackBar(msg);
  }
}
