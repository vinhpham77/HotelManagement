import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Room } from '../models/Room';
import { RoomDTO } from '../models/RoomDTO';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private roomAPI = environment.apiUrl + '/rooms';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private roomsSource = new BehaviorSubject<RoomDTO[]>([]);
  private rooms = new BehaviorSubject<Room[]>([]);

  rooms$ = this.roomsSource.asObservable();
  rooms$$ = this.rooms.asObservable();

  constructor(private httpClient: HttpClient) {

  }

  load() {
    this.getRooms('', '', 0, 8).subscribe(rooms => {
      this.roomsSource.next(rooms);
    });
  }

  getRooms(sort: string, order: SortDirection, page: number, limit: number) {
    // let url = this.roomTypesAPI + `?_page=${page + 1}&_limit=${limit}`;
    // url += sort ? `&_sort=${sort}&_order=${order}` : '';

    return this.httpClient.get<RoomDTO[]>(this.roomAPI, this.httpOptions);
  }

  getRoomById(_id: string) {
    let url = `${this.roomAPI}/${_id}`;
    return this.httpClient.get<any>(url, this.httpOptions);
  }

  uploadRoomAll() {
    let url = `${this.roomAPI}`;
    this.httpClient.get<Room[]>(url, this.httpOptions).subscribe({
      next: data => {
        this.convert(data);
        this.rooms.next(data);
      }
    })
  }

  convert(data: Room[]) {
    data.forEach(room => {
      room.cleanRoomAt = new Date(room.cleanRoomAt);
    })
  }

  create(room: Room) {
    return this.httpClient.post<Room>(this.roomAPI, room, this.httpOptions);
  }

  update(room: Room) {
    return this.httpClient.put<Room>(this.roomAPI + `/${room._id}`, room, this.httpOptions);
  }

  delete(_id: string) {
    return this.httpClient.delete<Room>(this.roomAPI + `/${_id}`);
  }
}
