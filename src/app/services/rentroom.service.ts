import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RentRoom } from '../models/rent-room';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentroomService {
  private rentRoomAPI = environment.apiUrl + '/RentRooms';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  rentRoomSource = new BehaviorSubject<RentRoom[]>([]);

  rentRoom$ = this.rentRoomSource.asObservable();
  constructor(private httpClient: HttpClient) { }

  uploadRentRoom() {
    let url = `${this.rentRoomAPI}`;
    this.httpClient.get<any>(url).subscribe({
      next: data => {
        this.convert(data);
        this.rentRoomSource.next(data);
      }
    });
  }

  loadByQuery(query: string) {
    let url = `${this.rentRoomAPI}?${query}`;
    this.httpClient.get<any>(url).subscribe({
      next: data => {
        this.convert(data);
        this.rentRoomSource.next(data);
      }
    });
  }

  convert(data: RentRoom[]) {
    data.forEach(rentRoom => {
      rentRoom.rooms.forEach(room => {
        if(room)
          room.lastCleanedAt = new Date(room.lastCleanedAt);
      })
    });
  }
}
