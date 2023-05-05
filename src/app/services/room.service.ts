import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Room } from '../models/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private rooms: Room[] = [
    { id: '1', name: 'Phòng VIP', roomType: '2', pricePerDay: 400000, status: false, cleanRoom: false, cleanRoomAt: new Date("03/05/2023 09:30:00"), description: '', maxAdults: 2, maxChildren:2},
    { id: '2', name: 'Phòng 202', roomType: '1', pricePerDay: 200000, status: true, cleanRoom: false, cleanRoomAt: new Date("03/05/2023 09:30:00"), description: '', maxAdults: 1, maxChildren:0},
  ];

  roomSource = new BehaviorSubject<Room[]>(this.rooms);

  roomSource$ = this.roomSource.asObservable();

  get Rooms() {
    return this.roomSource.next(this.rooms);
  }
}
