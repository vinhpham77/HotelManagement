import { Injectable } from '@angular/core';
import { RoomType } from '../models/RoomType';
import { BehaviorSubject, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SortDirection } from '@angular/material/sort';
import { TableData } from '../models/TableData';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})

export class RoomTypesService {
  private roomTypesAPI = environment.apiUrl + '/RoomTypes';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private roomTypesSource = new BehaviorSubject<RoomType[]>([]);

  roomTypes$ = this.roomTypesSource.asObservable();

  constructor(private httpClient: HttpClient, private commonService: CommonService) {

  }

  load() {
    let { keyword, sort, order, page, size } = this.commonService.tableData;
    this.getRoomTypes(keyword, sort, order, page, size).subscribe(result => {
      this.roomTypesSource.next(result.items);
    });
  }

  getRoomTypes(keyword: string, sort: string, order: SortDirection, page: number, size: number) {
    this.commonService.tableData = { keyword, sort, order, page, size };
    let url = `${this.roomTypesAPI}?keyword=${keyword}&sort=${sort}&order=${order}&page=${page + 1}&size=${size}`;
    return this.httpClient.get<any>(url);
  }

  uploadRoomTypeAll() {
    this.httpClient.get<any>(this.roomTypesAPI, this.httpOptions).subscribe({
      next: data => {
        this.roomTypesSource.next(data);
      }
    })
  }

  create(roomType: RoomType) {
    return this.httpClient.post<RoomType>(this.roomTypesAPI, roomType, this.httpOptions);
  }

  update(roomType: RoomType) {
    return this.httpClient.put<RoomType>(this.roomTypesAPI + `/${roomType.id}`, roomType, this.httpOptions);
  }

  delete(_id: string) {
    return this.httpClient.delete<RoomType>(this.roomTypesAPI + `/${_id}`);
  }

  deleteMany(roomTypeIds: string[]) {
    const options = { ...this.httpOptions, body: roomTypeIds };
    return this.httpClient.delete<any>(this.roomTypesAPI + '/DeleteMany', options);
  }
}
