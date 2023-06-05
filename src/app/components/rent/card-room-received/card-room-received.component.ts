import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Room } from 'src/app/models/Room';
import { ReservationDetail } from 'src/app/models/reservation-detail';
import { OrderService } from 'src/app/services/order.service';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-card-room-received',
  templateUrl: './card-room-received.component.html',
  styleUrls: ['./card-room-received.component.scss']
})
export class CardRoomReceivedComponent implements OnInit, OnChanges{
  @Input() room!: Room;
  @Input() dateCheck!: Date;
  @Output() open = new EventEmitter;
  @Output() clean = new EventEmitter;
  public priceOrder!: number;
  public priceRoom!: number;
  public intoMoney!: number;
  public reServationDetail: ReservationDetail = <ReservationDetail>{};

  constructor(public dialog: MatDialog,
    private reServationDetailService: ReservationDetailService,
    private orderService: OrderService
    ) {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setData(this.room.id);
  }

  setData(roomId: string) {
    this.reServationDetailService.getReservationDetail(roomId).subscribe((data) => {
      this.reServationDetail = data[0];
      this.reServationDetail.checkInAt = new Date(this.reServationDetail.checkInAt);
      this.reServationDetail.checkOutAt = null;
      this.orderService.getOrderByReservationDetail(this.reServationDetail).subscribe({
        next: data => {
          this.priceOrder = this.orderService.getTotalOrderByReservationId(data[0]);
          this.priceRoom = this.getPriceRoom();
          this.intoMoney = this.getIntoMoney();
        }
      });
    });
  }

  public VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  daysIn() {
    return this.reServationDetailService.daysIn(this.reServationDetail.checkInAt, this.dateCheck);
  }

  getPriceRoom(): number {
    if(Object.keys(this.reServationDetail).length > 0)
      return this.reServationDetailService.roomPriceDay(this.reServationDetail, this.reServationDetail.checkInAt, this.dateCheck) + this.reServationDetailService.roomSurcharge(this.reServationDetail, this.room, this.reServationDetail.checkInAt, this.dateCheck);
    return 0;
  }

  getDeposits() {
    return this.reServationDetail.deposits;
  }

  getIntoMoney() {
    return (this.priceRoom + this.priceOrder - this.getDeposits());
  }

  openPanel(namePanel: string) {
    this.open.emit(namePanel);
  }

  onCleanRoom() {
    this.clean.emit(this.room);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {content: "", field: "", id: "", setting: ""},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
