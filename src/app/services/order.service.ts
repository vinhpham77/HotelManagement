import { ReservationDetail } from '../models/ReservationDetail';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order } from '../models/order';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderDetail } from '../models/order-detail';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderAPI = environment.apiUrl + '/Orders';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  ordersSource = new BehaviorSubject<Order[]>([]);

  orders$ = this.ordersSource.asObservable();

  constructor(private httpClient: HttpClient) {

  }
  uploadOrderAll() {
    let url = `${this.orderAPI}`;
    this.httpClient.get<any>(url).subscribe({
      next: data => {
        this.ordersSource.next(data);
      }
    });
  }

  getOrderByReservationDetail(reservationDetail: ReservationDetail) {
    let url = `${this.orderAPI}?reservationDetailId=${reservationDetail.id}`;
    return this.httpClient.get<Order>(url, this.httpOptions);
  }

  getTotalOrderByReservationId(order: Order){
    let total = 0;
    order.details.forEach(item => total += item.price * item.quantity);
    return total;
  }

  create(orderItem: Order) {
    return this.httpClient.post<Order>(this.orderAPI, orderItem, this.httpOptions);
  }

  update(orderItem: Order) {
    return this.httpClient.put<Order>(`${this.orderAPI}/${orderItem.id}`, orderItem, this.httpOptions);
  }

  delete(_id: string) {
    return this.httpClient.delete<Order>(this.orderAPI + `/${_id}`);
  }
}
