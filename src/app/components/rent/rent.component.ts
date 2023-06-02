import { Component, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Room } from 'src/app/models/Room';
import { RoomType } from 'src/app/models/RoomType';
import { Receipt } from 'src/app/models/receipt';
import { OrderService } from 'src/app/services/order.service';
import { ReceiptService } from 'src/app/services/receipt.service';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { RoomTypesService } from 'src/app/services/room-types.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-rent',
  templateUrl: './rent.component.html',
  styleUrls: ['./rent.component.scss']
})
export class RentComponent implements OnDestroy{
  public b = true;
  public namePanel: string = "under";
  public rooms: Room[] = [];
  public roomTypes: RoomType[] = [];
  public receipts: Receipt[] = [];
  public checkOut = new Date();
  public roomId: string = '';
  public receiptId: string = '';
  subscriptionRoom = new Subscription();
  subscriptionRoomType = new Subscription();
  subscriptionReceipts = new Subscription();

  constructor(public dialog: MatDialog, 
    public roomService: RoomsService, 
    public roomTypeService: RoomTypesService,
    public reservationDetailService: ReservationDetailService, 
    public orderService: OrderService,
    public receiptsService: ReceiptService,
    public reservationService: ReservationService,
    public fb: FormBuilder) {
    this.subscriptionRoom = this.roomService.rooms$$.subscribe(result =>this.rooms = result);
    this.roomService.uploadRoomAll();
    this.subscriptionRoomType = this.roomTypeService.roomTypes$.subscribe(result =>this.roomTypes = result);
    roomTypeService.uploadRoomTypeAll();
    this.subscriptionReceipts = this.receiptsService.receipt$.subscribe(result =>this.receipts = result);
    receiptsService.uploadReceiptAll();
  }
  ngOnDestroy() {

    if (this.subscriptionRoom) {
      this.subscriptionRoom.unsubscribe();
      return;
    }
    if (this.subscriptionRoomType) {
      this.subscriptionRoomType.unsubscribe();
      return;
    }
    if (this.subscriptionReceipts) {
      this.subscriptionReceipts.unsubscribe();
      return;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {content: "", field: "", id: "", setting: ""},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
  onCleanRoom(room: Room): void{
    room.cleanRoom = !room.cleanRoom;
    room.cleanRoomAt = new Date();
    this.roomService.update(room).subscribe({
      next: next => this.roomService.uploadRoomAll()
    })
  }

  reload(event: any) {
    this.orderService.uploadOrderAll();
    this.roomService.uploadRoomAll();
    this.reservationDetailService.uploadReservationDetailAll();
    this.receiptsService.uploadReceiptAll();
    this.namePanel = "under";
  }

  openPanel(name: string, roomSelect: Room): void {
    this.namePanel = name;
    this.roomId = roomSelect._id;
  }

  openPanelChangeReceipt(name: string, receiptSelect: Receipt): void {
    this.namePanel = name;
    this.receiptId = receiptSelect.id;
  }

  days(date: Date) {
    let t = Math.floor((this.checkOut.getTime() - date.getTime()) / (24*60*60*1000));
    return t;
  }

  // getDaysIn
  

}
