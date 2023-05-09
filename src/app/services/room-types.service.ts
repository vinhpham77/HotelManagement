import { Injectable } from '@angular/core';
import { RoomType } from '../models/RoomType';
import { BehaviorSubject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DialogConfirm } from '../models/dialog-confirm';

@Injectable({
  providedIn: 'root'
})

export class RoomTypesService {
  roomTypesSource = new BehaviorSubject<RoomType[]>([]);
  roomTypes$ = this.roomTypesSource.asObservable();
  roomTypesAPI = environment.apiUrl + '/roomTypes';

  constructor(private httpClient: HttpClient) {
    this.RoomTypes
  }

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": 'application/json'
    })
  };

  get RoomTypes() {
    return this.httpClient.get<RoomType[]>(this.roomTypesAPI, this.httpOptions)
      .pipe(
        tap({
          next: (data) => {
            this.roomTypesSource.next(data);
          },
          error: (error) => {
            throwError(() => {
              return {
               content: "Có lỗi xảy ra. Vui lòng thử lại sau.",
               setting: "alert",
              }
            });
          }
        })
      );
  }

  getRoomTypes(sort: string, order: string, page: number, limit: number) {
    let url = this.roomTypesAPI + `?_page=${page + 1}&_limit=${limit}`;
    url += sort ? `&_sort=${sort}&_order=${order}` : '';

    return this.httpClient.get<RoomType[]>(this.roomTypesAPI, this.httpOptions)
      .pipe(
        tap({
          next: (data) => {
            this.roomTypesSource.next(data);
          },
          error: (error) => {
            throwError(() => {
              return {
               content: "Có lỗi xảy ra. Vui lòng thử lại sau.",
               setting: "alert",
              }
            });
          }
        })
      );
  }
}
