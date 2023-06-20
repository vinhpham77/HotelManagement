import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';
import { MergeCD } from '../models/merge-cd';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MergeCDService {

  private mergeCDAPI = environment.apiUrl + '/MergeCD';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private receiptDtosSource = new BehaviorSubject<MergeCD[]>([]);

  receiptDtos$ = this.receiptDtosSource.asObservable();

  constructor(private httpClient: HttpClient) {
  }
  getMergeCD(startDate:string | null | undefined, endDate:string | null | undefined ) {

let url = `${this.mergeCDAPI}?startDate=${startDate}&endDate=${endDate}`;

return this.httpClient.get<any>(url, this.httpOptions);
}
uploadMergeCDAll() {
  let url = `${this.getMergeCD}`;
  this.httpClient.get<any>(url, this.httpOptions).subscribe({
    next: data => {
      this.convert(data.items);
      this.receiptDtosSource.next(data.items);
    }
  });
}
convert(data: MergeCD[]) {
  data.forEach(cd => {
    cd.ReservationDetail.checkedInAt= new Date(cd.ReservationDetail.checkedInAt);
    if(cd.ReservationDetail.checkedOutAt)
    cd.ReservationDetail.checkedOutAt=new Date(cd.ReservationDetail.checkedOutAt)
  });
}
}
