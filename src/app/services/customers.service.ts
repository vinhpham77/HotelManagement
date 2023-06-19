import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Customer } from '../models/Customer';
import { CommonService } from './common.service';
import { SortDirection } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private customersAPI = environment.apiUrl + '/Customers';
  private customersSource = new BehaviorSubject<Customer[]>([]);
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  customers$ = this.customersSource.asObservable();

  constructor(private httpClient: HttpClient, private commonService: CommonService) {
  }

  load() {
    let { keyword, sort, order, page, size } = this.commonService.tableData;
    this.getCustomers(keyword, sort, order, page, size).subscribe(result => {
      this.customersSource.next(result.items);
    });
  }

  getCustomers(keyword: string, sort: string, order: SortDirection, page: number, size: number) {
    this.commonService.tableData = { keyword, startDate: null, endDate: null, sort, order, page, size };
    let url = `${this.customersAPI}?keyword=${keyword}&sort=${sort}&order=${order}&page=${page + 1}&size=${size}`;
    return this.httpClient.get<any>(url);
  }

  getCustomersByNoId(idNo: string)
  {
    let url = `${this.customersAPI}?idNo=${idNo}`;
    return this.httpClient.get<any>(url);
  }

  create(customer: Customer) {
    return this.httpClient.post<Customer>(this.customersAPI, customer, this.httpOptions);
  }

  update(customer: Customer) {
    return this.httpClient.put<Customer>(`${this.customersAPI}/${customer.id}`, customer, this.httpOptions);
  }

  delete(_id: string) {
    return this.httpClient.delete<Customer>(this.customersAPI + `/${_id}`);
  }

  deleteMany(customerId: string[]) {
    const options = { ...this.httpOptions, body: customerId };
    return this.httpClient.delete<any>(this.customersAPI, options);
  }
}
