import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Room } from 'src/app/models/Room';
import { Receipt } from 'src/app/models/receipt';
import { ReservationDetail } from 'src/app/models/reservation-detail';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-card-history',
  templateUrl: './card-history.component.html',
  styleUrls: ['./card-history.component.scss']
})
export class CardHistoryComponent {
  @Input() receipt!: Receipt;
  public room: Room = <Room>{};
  public reservationDetail: ReservationDetail = <ReservationDetail>{};
  @Input() dateCheck!: Date;
  @Output() open = new EventEmitter();

  constructor(
    private roomsService: RoomsService,
    private reservationDetailService: ReservationDetailService,
  ) {}

  ngOnChanges() {
    this.setDate();
  }

  setDate() {
    this.reservationDetailService.getReservationDetailById(this.receipt.reservationDetailId).subscribe({
      next: next => {
        this.roomsService.getRoomById(next.roomId).subscribe({
          next: next => {this.room = next},
          error: err => {}
        })
      },
      error: err => {}
    })
  }

  days(date: Date) {
    let t = Math.floor((this.dateCheck.getTime() - date.getTime()) / (24*60*60*1000));
    return t;
  }

  public VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  openPanelChangeReceipt(name: string) {
    this.open.emit(name);
  }
}
