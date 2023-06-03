import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Room } from '../models/Room';
import { RoomDto } from '../models/RoomDto';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private roomAPI = environment.apiUrl + '/rooms';
  private roomDtoAPI = environment.apiUrl + '/RoomDtos';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private roomDtosSource = new BehaviorSubject<RoomDto[]>([]);
  private rooms = new BehaviorSubject<Room[]>([]);

  roomsDtos$ = this.roomDtosSource.asObservable();
  rooms$ = this.rooms.asObservable();

  constructor(private httpClient: HttpClient, private commonService: CommonService) {
  }

  load() {
    let { keyword, sort, order, page, size } = this.commonService.tableData;
    this.getRoomDtos(keyword, sort, order, page, size).subscribe(rooms => {
      this.roomDtosSource.next(rooms);
    });
  }

  getRoomDtos(keyword: string, sort: string, order: SortDirection, page: number, size: number) {
    this.commonService.tableData = { keyword, sort, order, page, size };
    let url = `${this.roomDtoAPI}?keyword=${keyword}&sort=${sort}&order=${order}&page=${page + 1}&size=${size}`;

    return this.httpClient.get<any>(this.roomDtoAPI, this.httpOptions);
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
      room.lastCleanedAt = new Date(room.lastCleanedAt);
    })
  }

  create(room: Room) {
    return this.httpClient.post<Room>(this.roomAPI, room, this.httpOptions);
  }

  update(room: Room) {
    return this.httpClient.put<Room>(this.roomAPI + `/${room.id}`, room, this.httpOptions);
  }

  delete(_id: string) {
    return this.httpClient.delete<Room>(this.roomAPI + `/${_id}`);
  }

  deleteMany(_ids: string[]) {
    const options = { ...this.httpOptions, body: _ids };
    return this.httpClient.delete<Room>(this.roomAPI + options);
  }
}
