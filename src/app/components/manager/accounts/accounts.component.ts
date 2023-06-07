import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Account } from '../../../models/Account';
import { catchError, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { DialogConfirm } from '../../../models/dialog-confirm';
import { DialogComponent } from '../../dialog/dialog.component';
import { AccountsService } from '../../../services/accounts.service';
import { CuAccountComponent } from '../cu-account/cu-account.component';
import { accountRoles } from '../../../../assets/accountRoles';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit, OnDestroy, AfterViewInit {
  timer: any;
  dataSource: Account[] = [];
  roles: { [key: string]: string } = accountRoles.reduce((acc, role) => {
    // @ts-ignore
    acc[role.name] = role.meaning;
    return acc;
  }, {});

  displayedColumns: string[] = ['select', 'username', 'status', 'role', 'actions'];
  subscription = new Subscription();
  selections = new SelectionModel<Account>(true, []);
  searchValue = '';
  paginatorSizeOptions: number[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;

  constructor(public dialog: MatDialog, private accountsService: AccountsService, private commonService: CommonService) {
    this.paginatorSizeOptions = this.commonService.PaginatorOptions;
    this.subscription = this.accountsService.account$.subscribe(data => {
      this.dataSource = data;
      this.selections.clear();
    });
  }

  ngOnInit() {
    this.commonService.Form = CuAccountComponent;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.loadAccounts();
  }

  loadAccounts() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.accountsService.getAccounts(
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
      this.loadAccounts();
    }, 500);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showCreatingForm() {
    this.commonService.FormData = { title: 'Thêm mới', action: 'create' };
  }

  showEditingForm(account: Account) {
    this.commonService.FormData = { title: 'Cập nhật', action: 'update', object: account };
  }

  onDelete(account: Account) {
    this.accountsService.delete(account.username).subscribe(() => {
      this.refreshOnSuccess('Xoá thành công tài khoản ' + account.username);
    });
  }

  onDeleteMany() {
    const usernames = this.selections.selected.map(account => account.username);
    this.accountsService.deleteMany(usernames).subscribe(() => {
      this.refreshOnSuccess('Xoá thành công ' + usernames.length + ' tài khoản');
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
      message: 'Bạn có chắc chắn muốn xoá ' + this.selections.selected.length + ' tài khoản đã chọn?',
      action: 'deleteMany',
      data: null
    });
  }

  openDeleteDialog(account: Account) {
    this.openDialog({
      title: 'Xác nhận xoá',
      message: 'Bạn có chắc chắn muốn xoá tài khoản ' + account.username + '?',
      action: 'delete',
      data: account
    });
  }

  refreshOnSuccess(msg: string) {
    this.loadAccounts();
    this.commonService.openSnackBar(msg);
  }

  toggleStatus(account: Account) {
    account.status = !account.status;
    this.accountsService.toggleStatus(account).subscribe(() => {
      this.refreshOnSuccess('Cập nhật trạng thái thành công');
    });
  }
}
