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
    this.commonService.tableData = { keyword, sort, order, page, size };
    let url = `${this.staffAPI}?keyword=${keyword}&sort=${sort}&order=${order}&page=${page + 1}&size=${size}`;

    return this.httpClient.get<any>(url, this.httpOptions);
  }

  getRoomById(_id: string) {
    let url = `${this.staffAPI}/${_id}`;
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  create(personnel: Personnel) {
    return this.httpClient.post<Personnel>(this.staffAPI, personnel, this.httpOptions);
  }

  patch(personnel: Personnel) {
    const patchDoc = [
      { op: 'replace', path: '/firstName', value: personnel.firstName },
      { op: 'replace', path: '/lastName', value: personnel.lastName },
      // { op: 'replace', path: '/maxAdult', value: room.maxAdult },
      // { op: 'replace', path: '/maxChild', value: room.maxChild },
      // { op: 'replace', path: '/description', value: room.description }
    ];
    return this.httpClient.patch<any>(this.staffAPI + `/${personnel.id}`, patchDoc);
  }

  delete(personnelId: string) {
    return this.httpClient.delete<any>(this.staffAPI + `/${personnelId}`);
  }

  deleteMany(personnelIds: string[]) {
    const options = { ...this.httpOptions, body: personnelIds };
    return this.httpClient.delete<any>(this.staffAPI, options);
  }
}
