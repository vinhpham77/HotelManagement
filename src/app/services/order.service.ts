import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [
    { id: '1', 
      reservationDetailId: '1', 
      details: []
    },
    { id: '2', 
      reservationDetailId: '2', 
      details: []
    },
  ];

  ordersSource = new BehaviorSubject<Order[]>(this.orders);

  ordersSource$ = this.ordersSource.asObservable();

  get Orders() {
    return this.ordersSource.next(this.orders);
  }

  public totalOrder(reservationDetailId: string): number{
    let order = this.orders.find(each => each.reservationDetailId === reservationDetailId)
    let result = 0;
    order?.details.forEach(element => {
      result += element.price * element.quantity;
    });

    return result;
  }
}
