import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from './common.service';
import { SortDirection } from '@angular/material/sort';
import { Personnel } from '../models/Personnel';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private staffAPI = environment.apiUrl + '/staff';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private staffSource = new BehaviorSubject<Personnel[]>([]);

  staff$ = this.staffSource.asObservable();

  constructor(private httpClient: HttpClient, private commonService: CommonService) {
  }

  load() {
    let { keyword, sort, order, page, size } = this.commonService.tableData;
    this.getStaff(keyword, sort, order, page, size).subscribe(data => {
      this.staffSource.next(data.items);
    });
  }

  getStaff(keyword: string, sort: string, order: SortDirection, page: number, size: number) {
    this.commonService.tableData = { keyword, startDate: null, endDate: null, sort, order, page, size };
    let url = `${this.staffAPI}?keyword=${keyword}&sort=${sort}&order=${order}&page=${page + 1}&size=${size}`;

    return this.httpClient.get<any>(url, this.httpOptions);
  }

  create(personnel: Personnel) {
    return this.httpClient.post<Personnel>(this.staffAPI, personnel, this.httpOptions);
  }

  update(personnel: Personnel) {
    return this.httpClient.put<any>(this.staffAPI + `/${personnel.id}`, personnel, this.httpOptions);
  }

  delete(personnelId: string) {
    return this.httpClient.delete<any>(this.staffAPI + `/${personnelId}`);
  }

  deleteMany(personnelIds: string[]) {
    const options = { ...this.httpOptions, body: personnelIds };
    return this.httpClient.delete<any>(this.staffAPI, options);
  }
}
