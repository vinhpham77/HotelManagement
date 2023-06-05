import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Customer } from '../../../models/Customer';
import { catchError, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CustomersService } from '../../../services/customers.service';
import { CommonService } from '../../../services/common.service';
import { CuCustomerComponent } from '../cu-customer/cu-customer.component';
import { DialogConfirm } from '../../../models/dialog-confirm';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnDestroy, OnInit, AfterViewInit {
  timer: any;
  dataSource: Customer[] = [];
  displayedColumns: string[] = ['select', 'fullName', 'birthdate', 'sex', 'idNo', 'phoneNumber', 'address', 'nationality', 'actions'];
  subscription = new Subscription();
  selections = new SelectionModel<Customer>(true, []);
  searchValue = '';
  paginatorSizeOptions: number[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;

  constructor(public dialog: MatDialog, private customersService: CustomersService, private commonService: CommonService) {
    this.paginatorSizeOptions = this.commonService.PaginatorOptions;

    this.subscription = this.customersService.customers$.subscribe(data => {
      this.dataSource = data;
    });
  }

  ngOnInit() {
    this.commonService.Form = CuCustomerComponent;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.loadCustomers();
  }

  loadCustomers() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.customersService.getCustomers(
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
      this.loadCustomers();
    }, 500);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showCreatingForm() {
    this.commonService.FormData = { title: 'Thêm mới', action: 'create' };
  }

  showEditingForm(customer: Customer) {
    this.commonService.FormData = { title: 'Cập nhật', action: 'update', object: customer };
  }

  onDelete(customer: Customer) {
    this.customersService.delete(customer.id).subscribe(() => {
      this.refreshOnSuccess('Xoá thành công khách hàng ' + customer.fullName);
    });
  }

  onDeleteMany() {
    const customerIds = this.selections.selected.map(customer => customer.id);
    this.customersService.deleteMany(customerIds).subscribe(() => {
      this.refreshOnSuccess('Xoá thành công ' + customerIds.length + ' khách hàng');
    });
  }

  refreshOnSuccess(msg: string) {
    this.loadCustomers();
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
      message: 'Bạn có chắc chắn muốn xoá ' + this.selections.selected.length + ' khách hàng đã chọn?',
      action: 'deleteMany',
      data: null
    });
  }

  openDeleteDialog(customer: Customer) {
    this.openDialog({
      title: 'Xác nhận xoá',
      message: 'Bạn có chắc chắn muốn xoá khách hàng ' + customer.fullName + '?',
      action: 'delete',
      data: customer
    });
  }
}
