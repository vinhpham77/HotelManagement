import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reservation } from '../models/reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private reservations: Reservation[] = [
    { id: '1', 
      roomIds: ['2'], 
      customerId: '1',
      employeeId: '1',
      reservedAt: new Date("02/05/2023 09:30:00"),
    },
  ];

  reservationsSource = new BehaviorSubject<Reservation[]>(this.reservations);

  reservationsSource$ = this.reservationsSource.asObservable();

  get Reservations() {
    return this.reservationsSource.next(this.reservations);
  }
}
