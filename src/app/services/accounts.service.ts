import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from './common.service';
import { SortDirection } from '@angular/material/sort';
import { Account } from '../models/Account';
import { AccountDto } from '../models/AccountDto';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private accountAPI = environment.apiUrl + '/accounts';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private accountSource = new BehaviorSubject<Account[]>([]);

  account$ = this.accountSource.asObservable();

  constructor(private httpClient: HttpClient, private commonService: CommonService) {
  }

  load() {
    let { keyword, sort, order, page, size } = this.commonService.tableData;
    this.getAccounts(keyword, sort, order, page, size).subscribe(data => {
      this.accountSource.next(data.items);
    });
  }

  getAccounts(keyword: string, sort: string, order: SortDirection, page: number, size: number) {
    this.commonService.tableData = { keyword, startDate: null, endDate: null, sort, order, page, size };
    let url = `${this.accountAPI}?keyword=${keyword}&sort=${sort}&order=${order}&page=${page + 1}&size=${size}`;

    return this.httpClient.get<any>(url, this.httpOptions);
  }

  getUsernames() {
    let url = `${this.accountAPI}/usernames`;
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  create(account: Account) {
    return this.httpClient.post<any>(this.accountAPI, account, this.httpOptions);
  }

  update(account: Account) {
    return this.httpClient.put<any>(this.accountAPI + `/${account.username}`, account, this.httpOptions);
  }

  delete(username: string) {
    return this.httpClient.delete<any>(this.accountAPI + `/${username}`);
  }

  deleteMany(usernames: string[]) {
    const options = { ...this.httpOptions, body: usernames };
    return this.httpClient.delete<any>(this.accountAPI, options);
  }

  toggleStatus(account: Account) {
    const patchDoc = [
      { op: 'replace', path: '/status', value: account.status }
    ];

    return this.httpClient.patch<any>(this.accountAPI + `/${account.username}/status`, patchDoc);
  }
}
