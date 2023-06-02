import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../models/MenuItem';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from './common.service';
import { SortDirection } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuAPI = environment.apiUrl + '/Menu';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private menuSource = new BehaviorSubject<MenuItem[]>([]);

  menu$ = this.menuSource.asObservable();

  constructor(private httpClient: HttpClient, private commonService: CommonService) {

  }

  load() {
    let { keyword, sort, order, page, size } = this.commonService.tableData;
    this.getMenu(keyword, sort, order, page, size).subscribe(result => {
      this.menuSource.next(result.items);
    });
  }

  getMenuAll() {
    let url = `${this.menuAPI}`;
    return this.httpClient.get<any>(url);
  }

  getMenu(keyword: string, sort: string, order: SortDirection, page: number, size: number) {
    this.commonService.tableData = { keyword, sort, order, page, size };
    let url = `${this.menuAPI}?keyword=${keyword}&sort=${sort}&order=${order}&page=${page + 1}&size=${size}`;
    return this.httpClient.get<any>(url);
  }

  create(menuItem: MenuItem) {
    return this.httpClient.post<MenuItem>(this.menuAPI, menuItem, this.httpOptions);
  }

  update(menuItem: MenuItem) {
    return this.httpClient.put<MenuItem>(`${this.menuAPI}/${menuItem.id}`, menuItem, this.httpOptions);
  }

  delete(_id: string) {
    return this.httpClient.delete<MenuItem>(this.menuAPI + `/${_id}`);
  }

  deleteMany(menuItemId: string[]) {
    const options = { ...this.httpOptions, body: menuItemId };
    return this.httpClient.delete<any>(this.menuAPI + '/DeleteMany', options);
  }
}
