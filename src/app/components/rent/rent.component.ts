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
  public namePanel: string = "under";
  public rooms: Room[] = [];
  public roomTypes: RoomType[] = [];
  public receipts: Receipt[] = [];
  public checkedOut = new Date();
  public roomId: string = '';
  public receiptId: string = '';
  public order: string = 'asc';
  public selected = 'name';
  public keyword = '';
  public sort = 'name';
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
    this.subscriptionRoom = this.roomService.rooms$.subscribe(result =>this.rooms = result);
    this.loadRoom();
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

  loadRoom() {
    let query = `keyword=${this.keyword}&sort=${this.sort}&order=${this.order}`;
    this.roomService.loadByQuery(query);
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
    room.isCleaned = !room.isCleaned;
    room.lastCleanedAt = new Date();
    this.roomService.update(room).subscribe({
      next: next => this.loadRoom()
    })
  }

  reload(event: any) {
    this.orderService.uploadOrderAll();
    this.loadRoom()
    this.reservationDetailService.uploadReservationDetailAll();
    this.receiptsService.uploadReceiptAll();
    this.namePanel = "under";
  }

  onSort(order: string) {
    this.order = order;
    this.loadRoom();
  }

  onSearch(s: string) {
    this.keyword = s;
    this.loadRoom()
  }

  keyup() {
    this.loadRoom();
  }

  openPanel(name: string, roomSelect: Room): void {
    this.namePanel = name;
    this.roomId = roomSelect.id;
  }

  openPanelChangeReceipt(name: string, receiptSelect: Receipt): void {
    this.namePanel = name;
    this.receiptId = receiptSelect.id;
  }

  days(date: Date) {
    let t = Math.floor((this.checkedOut.getTime() - date.getTime()) / (24*60*60*1000));
    return t;
  }

  // getDaysIn


}
