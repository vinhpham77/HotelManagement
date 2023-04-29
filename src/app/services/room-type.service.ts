import { Injectable } from '@angular/core';
import { RoomType } from '../models/RoomType';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RoomTypeService {

  private roomTypes: RoomType[] = [
    { id: '1', name: 'Single', description: 'Single bed' },
    { id: '2', name: 'Double', description: 'Double bed' },
    { id: '3', name: 'Triple', description: 'Triple bed' },
  ];

  roomTypesSource = new BehaviorSubject<RoomType[]>(this.roomTypes);

  roomTypes$ = this.roomTypesSource.asObservable();

  get RoomTypes() {
    return this.roomTypesSource.next(this.roomTypes);
  }
}
