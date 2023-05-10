import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReservationDetail } from '../models/reservation-detail';

@Injectable({
  providedIn: 'root'
})
export class ReservationDetailService {
  private reservationDetails: ReservationDetail[] = [
    { id: '1', reservevationId: '1', roomId: '1', checkInAt: new Date("05/02/2023 09:30:00"), checkOutAt: new Date("03/05/2023 09:30:00"), customerId: '1', deposits: 0, totalAdults:2, totalChildren:2, roomPricePerDay: 400000 },
    { id: '2', reservevationId: '1', roomId: '2', checkInAt: new Date("05/03/2023 09:30:00"), checkOutAt: new Date(), customerId: '1', deposits: 10000, totalAdults:2, totalChildren:2, roomPricePerDay: 400000 },
  ];

  reservationDetailsSource = new BehaviorSubject<ReservationDetail[]>(this.reservationDetails);

  reservationDetailsSource$ = this.reservationDetailsSource.asObservable();

  get ReservationDetails() {
    return this.reservationDetailsSource.next(this.reservationDetails);
  }

  getId(roomId: string): string {
    let id = this.reservationDetails.find(each => each.roomId === roomId)?.id;
    if(id){
      return id;
    }
    return '';
  }

  getDeposits(roomId: string): number | undefined {
    return this.reservationDetails.find(each => each.roomId === roomId)?.deposits;
  }
}
