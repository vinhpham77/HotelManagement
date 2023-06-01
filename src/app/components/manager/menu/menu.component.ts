import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { DialogConfirm } from '../../../models/dialog-confirm';
import { DialogComponent } from '../../dialog/dialog.component';
import { MenuItem } from '../../../models/MenuItem';
import { CuMenuItemComponent } from '../cu-menu-item/cu-menu-item.component';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements AfterViewInit, OnDestroy {
  timer: any;
  dataSource = new MatTableDataSource<MenuItem>([]);
  displayedColumns: string[] = ['select', 'name', 'type', 'importPrice', 'exportPrice', 'actions'];
  subscription = new Subscription();
  selections = new SelectionModel<MenuItem>(true, []);
  searchValue = '';
  paginatorSizeOptions: number[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  resultsLength = 0;

  constructor(public dialog: MatDialog, private menuService: MenuService, private commonService: CommonService) {
    this.paginatorSizeOptions = this.commonService.PaginatorOptions;

    this.subscription = this.menuService.menu$.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngOnInit() {
    this.commonService.Form = CuMenuItemComponent;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.loadMenu();
  }

  loadMenu() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.menuService.getMenu(
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
      this.loadMenu();
    }, 500);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  showCreatingForm() {
    this.commonService.FormData = { title: 'Thêm mới', action: 'create' };
  }

  showEditingForm(menuItem: MenuItem) {
    this.commonService.FormData = { title: 'Cập nhật', action: 'update', object: menuItem };
  }

  onDelete(menuItem: MenuItem) {
    this.menuService.delete(menuItem.id).subscribe(() => {
      this.commonService.openSnackBar('Xoá thành công loại phòng ' + menuItem.name);
      this.loadMenu();
    });
  }

  onDeleteMany() {
    const menuItemIds = this.selections.selected.map(menuItem => menuItem.id);
    this.menuService.deleteMany(menuItemIds).subscribe(() => {
      this.commonService.openSnackBar('Xoá thành công ' + menuItemIds.length + ' loại phòng');
      this.loadMenu();
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
      message: 'Bạn có chắc chắn muốn xoá ' + this.selections.selected.length + ' dịch vụ đã chọn?',
      action: 'deleteMany',
      data: null
    });
  }

  openDeleteDialog(menuItem: MenuItem) {
    this.openDialog({
      title: 'Xác nhận xoá',
      message: 'Bạn có chắc chắn muốn xoá ' + menuItem.name + '?',
      action: 'delete',
      data: menuItem
    });
  }
}
