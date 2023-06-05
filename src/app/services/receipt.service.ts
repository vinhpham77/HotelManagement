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
  uploadReceiptAll() {
    let url = `${this.receiptAPI}`;
    this.httpClient.get<any>(url).subscribe({
      next: data => {
        this.convert(data.items);
        this.receiptSource.next(data.items);
      }
    });
  }

  convert(data: Receipt[]) {
    data.forEach(receipt => {
      receipt.createdAt = new Date(receipt.createdAt);
    });
  }

  getReceiptById(id: string) {
    let url = `${this.receiptAPI}/${id}`;
    return this.httpClient.get<any>(url, this.httpOptions);
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
