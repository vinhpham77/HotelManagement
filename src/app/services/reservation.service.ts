import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reservation } from '../models/reservation';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservationAPI = environment.apiUrl + '/reservations';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  reservationSource = new BehaviorSubject<Reservation[]>([]);

  reservartion$ = this.reservationSource.asObservable();

  constructor(private httpClient: HttpClient) {

  }
  uploadReservationAll() {
    let url = `${this.reservationAPI}`;
    this.httpClient.get<any>(url).subscribe({
      next: data => {
        this.convert(data.items);
        this.reservationSource.next(data.items);
      }
    });
  }

  convert(data: Reservation[]) {
    data.forEach(item => {
      item.reservedAt = new Date(item.reservedAt);
    })
  }

  create(reservationItem: Reservation) {
    return this.httpClient.post<Reservation>(this.reservationAPI, reservationItem, this.httpOptions);
  }

  update(reservationItem: Reservation) {
    return this.httpClient.put<Reservation>(`${this.reservationAPI}/${reservationItem.id}`, reservationItem, this.httpOptions);
  }

  delete(_id: string) {
    return this.httpClient.delete<Reservation>(this.reservationAPI + `/${_id}`);
  }
}
