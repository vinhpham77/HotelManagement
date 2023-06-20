import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReservationDetail } from '../models/ReservationDetail';
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
      item.checkedInAt = new Date(item.checkedInAt);
      if(item.checkedOutAt)
        item.checkedOutAt = new Date(item.checkedOutAt);
      else
        item.checkedOutAt = null;
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

  daysIn(checkedIn: Date, checkedOut: Date) {
    var t2 = new Date(checkedOut);
    t2.setHours(12);
    t2.setMinutes(0);
    t2.setSeconds(0);
    t2.setMilliseconds(0);
    var t1 = new Date(checkedIn);
    t1.setHours(12);
    t1.setMinutes(0);
    t1.setSeconds(0);
    t1.setMilliseconds(0);
    return Math.floor((t2.getTime() - t1.getTime()) / (24*60*60*1000)) + 1;
  }

  getTotalRoomPrice(reservationDetail: ReservationDetail, checkedIn: Date, checkedOut: Date): number {
    return reservationDetail.roomPricePerDay * this.daysIn(checkedIn, checkedOut);
  }

  getRoomSurcharge(reservationDetail: ReservationDetail, room: Room, checkedIn: Date, checkedOut: Date): number {
    let p = reservationDetail.roomPricePerDay;
    return p * this.surchargeCheckedIn(checkedIn) + p * this.surchargeCheckedOut(checkedOut) + p * 0.2 * this.adultsExceed(reservationDetail, room) + p * 0.1 * this.childrenExceed(reservationDetail, room);
  }

  surchargeCheckedIn(checkedIn: Date): number {
    var h = checkedIn.getHours();
    if(h >= 12)
      return 0;
    if(h >= 9)
      return 0.3;
    return  0.5;
  }

  surchargeCheckedOut(checkedOut: Date): number {
    var t = checkedOut.getHours();
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
