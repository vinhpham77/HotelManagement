import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BookRoomDTO } from '../models/book-room-dto';
import { CommonService } from './common.service';
import { SortDirection } from '@angular/material/sort';

@Injectable({
  providedIn: 'root'
})
export class BookRoomDTOService {

  private bookRoomDtoAPI = environment.apiUrl + '/BookRoomDtos';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private bookRoomDtosSource = new BehaviorSubject<BookRoomDTO[]>([]);
  bookRoomDtos$ = this.bookRoomDtosSource.asObservable();

  constructor(private httpClient: HttpClient) {
  }
  getBookRoomDtos(startDate:string | null | undefined, endDate:string | null | undefined, temp:boolean |null|undefined,  onlyReservedAt:boolean| null| undefined) {

let url = `${this.bookRoomDtoAPI}?startDate=${startDate}&endDate=${endDate}&temp=${temp}&onlyReservedAt=${onlyReservedAt}`;
console.log(url)

return this.httpClient.get<any>(url, this.httpOptions);
}
uploadBookRoomAll() {
  let url = `${this.bookRoomDtoAPI}`;
  this.httpClient.get<any>(url, this.httpOptions).subscribe({
    next: data => {
      this.convert(data.items);
      this.bookRoomDtosSource.next(data.items);
    }
  });
}

convert(data: BookRoomDTO[]) {
  data.forEach(bookroom => {
    bookroom.Reservation.reservedAt= new Date(bookroom.Reservation.reservedAt);
  });
}
}
