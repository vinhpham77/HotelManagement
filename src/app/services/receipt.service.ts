import { Receipt } from './../models/receipt';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Receipt } from '../models/receipt';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private receiptAPI = environment.apiUrl + '/receipts';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  receiptSource = new BehaviorSubject<Receipt[]>([]);

  receipt$ = this.receiptSource.asObservable();

  constructor(private httpClient: HttpClient) {

  }
  get ReceiptAll() {
    let url = `${this.receiptAPI}`;
    return this.httpClient.get<any>(url);
  }

  create(receiptItem: Receipt) {
    return this.httpClient.post<Receipt>(this.receiptAPI, receiptItem, this.httpOptions);
  }

  update(receiptItem: Receipt) {
    return this.httpClient.put<Receipt>(`${this.receiptAPI}/${receiptItem.id}`, receiptItem, this.httpOptions);
  }

  delete(_id: string) {
    return this.httpClient.delete<Receipt>(this.receiptAPI + `/${_id}`);
  }
}
