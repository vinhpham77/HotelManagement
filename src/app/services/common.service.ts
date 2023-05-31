import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TableData } from '../models/TableData';

@Injectable({
  providedIn: 'root'
})

export class CommonService {
  tableData!: TableData;
  private sidenavOpenedSource = new Subject<boolean>();
  private formSource = new Subject<any>();
  private formDataSource = new Subject<object>();
  private paginatorOptions = [8, 15, 25];

  sidenavOpened$ = this.sidenavOpenedSource.asObservable();
  form$ = this.formSource.asObservable();
  formData$ = this.formDataSource.asObservable();

  constructor(private _snackBar: MatSnackBar) {
  }

  get PaginatorOptions() {
    return this.paginatorOptions;
  }

  toggleSidenav(opened: boolean) {
    this.sidenavOpenedSource.next(opened);
  }

  set Form(component: any) {
    this.formSource.next(component);
  }

  set FormData(data: any) {
    this.formDataSource.next(data);
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Đóng', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 1500
    });
  }
}
