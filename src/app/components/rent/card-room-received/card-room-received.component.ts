import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Room } from 'src/app/models/Room';
import { ReservationDetail } from 'src/app/models/ReservationDetail';
import { OrderService } from 'src/app/services/order.service';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { Order } from 'src/app/models/order';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoomsService } from 'src/app/services/rooms.service';

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
  @Output() delete = new EventEmitter();
  public reServationDetail: ReservationDetail = <ReservationDetail>{};
  public order: Order = <Order>{};

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private roomService: RoomsService,
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
      this.reServationDetail = data.items[0];
      this.reServationDetail.checkedInAt = new Date(this.reServationDetail.checkedInAt);
      this.reServationDetail.checkedOutAt = null;
      this.orderService.getOrderByReservationDetail(this.reServationDetail).subscribe({
        next: data => {
          this.order = data[0];
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
    return this.reServationDetailService.daysIn(this.reServationDetail.checkedInAt, this.dateCheck);
  }

  getPriceRoom(): number {
    if(Object.keys(this.reServationDetail).length > 0)
      return this.reServationDetailService.getTotalRoomPrice(this.reServationDetail, this.reServationDetail.checkedInAt, this.dateCheck) + this.reServationDetailService.getRoomSurcharge(this.reServationDetail, this.room, this.reServationDetail.checkedInAt, this.dateCheck);
    return 0;
  }

  getDeposit() {
    return this.reServationDetail.deposit;
  }

  getIntoMoney() {
    return (this.priceRoom + this.priceOrder - this.getDeposit());
  }

  openPanel(namePanel: string) {
    this.open.emit(namePanel);
  }

  onCleanRoom() {
    this.clean.emit(this.room);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: "Xác nhận", message: "Bạn có muôn xóa dữ liệu", data: "", action: "delete"},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.room.isEmpty = true;
        this.roomService.update(this.room).subscribe({
          next: next => {
            this.reServationDetailService.delete(this.reServationDetail.id).subscribe({
              next: next => {
                this.orderService.delete(this.order.id).subscribe({
                  next: next => {
                    this._snackBar.open("Xóa dữ liệu thành cồng", "",{
                      duration: 1000,
                      horizontalPosition: 'right',
                      verticalPosition: 'top',
                    });
                    this.delete.emit();
                  }
                })
              }
            });
          }
        })
      }
    });
  }
}
