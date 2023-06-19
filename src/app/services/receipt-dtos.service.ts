import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ReceiptDto } from '../models/ReceiptDto';
import { CommonService } from './common.service';
import { SortDirection } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class ReceiptDtosService {
  private receiptDtoAPI = environment.apiUrl + '/receiptDtos';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private receiptDtosSource = new BehaviorSubject<ReceiptDto[]>([]);

  receiptDtos$ = this.receiptDtosSource.asObservable();

  constructor(private httpClient: HttpClient, private commonService: CommonService) {
  }

  load() {
    let {
      keyword,
      startDate,
      endDate,
      sort,
      order,
      page,
      size
    }
      = this.commonService.tableData;
    this.getReceiptDtos(keyword, startDate, endDate, sort, order, page, size).subscribe(data => {
      this.receiptDtosSource.next(data.items);
    });
  }

  getReceiptDtos(keyword: string, startDate: string | null | undefined, endDate: string | null | undefined,
                 sort: string, order: SortDirection, page: number, size: number) {
    this.commonService.tableData = { keyword, startDate, endDate, sort, order, page, size };

    let url = `${this.receiptDtoAPI}?keyword=${keyword}&startDate=${startDate}&endDate=${endDate}&sort=${sort}&order=${order}&page=${page + 1}&size=${size}`;

    return this.httpClient.get<any>(url, this.httpOptions);
  }

  create(personnel: ReceiptDto) {
    return this.httpClient.post<ReceiptDto>(this.receiptDtoAPI, personnel, this.httpOptions);
  }

  update(personnel: ReceiptDto) {
    return this.httpClient.put<any>(this.receiptDtoAPI + `/${personnel.id}`, personnel, this.httpOptions);
  }

  delete(personnelId: string) {
    return this.httpClient.delete<any>(this.receiptDtoAPI + `/${personnelId}`);
  }

  deleteMany(personnelIds: string[]) {
    const options = { ...this.httpOptions, body: personnelIds };
    return this.httpClient.delete<any>(this.receiptDtoAPI, options);
  }
}
