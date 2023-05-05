import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Receipt } from '../models/receipt';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private receipts: Receipt[] = [
    { id: '1', 
      employeeId: '1', 
      reservationDetailId: '1',
      createdAt: new Date("02/05/2023 09:30:00"),
      orderPrice: 0,
      roomPrice: 100000,
    },
  ];

  receiptsSource = new BehaviorSubject<Receipt[]>(this.receipts);

  receiptsSource$ = this.receiptsSource.asObservable();

  get Receipts() {
    return this.receiptsSource.next(this.receipts);
  }
}
