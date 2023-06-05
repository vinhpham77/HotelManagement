import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReservationDetail } from '../models/reservation-detail';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Room } from '../models/Room';

@Injectable({
  providedIn: 'root'
})
export class ReservationDetailService {
  private reservationDetailAPI = environment.apiUrl + '/reservationdetails';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  reservationDetailSource = new BehaviorSubject<ReservationDetail[]>([]);

  reservationDetail$ = this.reservationDetailSource.asObservable();

  constructor(private httpClient: HttpClient) {

  }
  uploadReservationDetailAll() {
    let url = `${this.reservationDetailAPI}`;
    this.httpClient.get<any>(url).subscribe({
      next: data => {
        this.convert(data.items);
        this.reservationDetailSource.next(data.items);
      }
    });
  }

  convert(data: ReservationDetail[]) {
    data.forEach(item => {
      item.checkInAt = new Date(item.checkInAt);
      if(item.checkOutAt)
        item.checkOutAt = new Date(item.checkOutAt);
      else
        item.checkOutAt = null;
    })
  }

  getReservationDetail(roomId: string) {
    let url = `${this.reservationDetailAPI}?roomId=${roomId}&checkedOut=false`;
    return this.httpClient.get<any>(url);
  }

  getReservationDetailById(_id: string) {
    let url = `${this.reservationDetailAPI}/${_id}`;
    return this.httpClient.get<any>(url);
  }

  create(reservationDetailItem: ReservationDetail) {
    return this.httpClient.post<ReservationDetail>(this.reservationDetailAPI, reservationDetailItem, this.httpOptions);
  }

  update(reservationDetailItem: ReservationDetail) {
    return this.httpClient.put<ReservationDetail>(`${this.reservationDetailAPI}/${reservationDetailItem.id}`, reservationDetailItem, this.httpOptions);
  }

  delete(_id: string) {
    return this.httpClient.delete<ReservationDetail>(this.reservationDetailAPI + `/${_id}`);
  }

  daysIn(checkIn: Date, checkOut: Date) {
    var t2 = new Date(checkOut);
    t2.setHours(12);
    t2.setMinutes(0);
    var t1 = new Date(checkIn);
    t1.setHours(12);
    t1.setMinutes(0);
    return Math.floor((t2.getTime() - t1.getTime()) / (24*60*60*1000));
  }

  roomPriceDay(reservationdetail: ReservationDetail, checkIn: Date, checkOut: Date): number {
    return reservationdetail.roomPricePerDay * this.daysIn(checkIn, checkOut);
  }

  roomSurcharge(reservationdetail: ReservationDetail, room: Room, checkIn: Date, checkOut: Date): number {
    let p = reservationdetail.roomPricePerDay;
    return p * this.surchargeCheckIn(checkIn) + p * this.surchargeCheckOut(checkOut) + 200000 * this.adultsExceed(reservationdetail, room) + 100000 * this.childrenExceed(reservationdetail, room);
  }

  surchargeCheckIn(checkIn: Date): number {
    var h = checkIn.getHours();
    if(h >= 14)
      return 0;
    if(h >= 9)
      return 0.3;
    return  0.5;
  }

  surchargeCheckOut(checkOut: Date): number {
    var t = checkOut.getHours();
    if(t >= 18)
      return 1;
    if(t >= 15)
      return 0.5;
    if(t >= 12)
      return  0.3;
    return 0;
  }

  adultsExceed(reservationdetail: ReservationDetail, room: Room): number {
    if(reservationdetail.totalAdults > room.maxAdult)
      return reservationdetail.totalAdults - room.maxAdult;
    return 0;
  }

  childrenExceed(reservationdetail: ReservationDetail, room: Room): number {
    if(reservationdetail.totalChildren > room.maxChild)
      return reservationdetail.totalChildren - room.maxChild;
    return 0;
  }
}
