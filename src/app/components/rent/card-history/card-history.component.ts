import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Room } from 'src/app/models/Room';
import { Receipt } from 'src/app/models/receipt';
import { ReservationDetail } from 'src/app/models/ReservationDetail';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import { ReceiptService } from 'src/app/services/receipt.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private roomsService: RoomsService,
    private orderService: OrderService,
    private receiptService: ReceiptService,
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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {title: "Xác nhận", message: "Bạn có muôn xóa dữ liệu", data: "", action: "delete"},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
      {
        this.receiptService.delete(this.receipt.id).subscribe({
          next: next => {
            this.orderService.getOrderByReservationDetail(this.reservationDetail).subscribe(data => {
              this.orderService.delete(data[0].id).subscribe({
                next: next => {
                  this.reservationDetailService.delete(this.reservationDetail.id).subscribe({
                    next: next => {
                      this._snackBar.open("Xóa dữ liệu thành cồng", "",{
                        duration: 1000,
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                      });
                      this.receiptService.uploadReceiptAll();
                    }
                  });
                }
              });
            })
          }
        });
        
      }
    });
  }
}
