import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { Room } from 'src/app/models/Room';
import { Order } from 'src/app/models/order';
import { OrderDetail } from 'src/app/models/order-detail';
import { Receipt } from 'src/app/models/receipt';
import { ReservationDetail } from 'src/app/models/ReservationDetail';
import { MenuService } from 'src/app/services/menu.service';
import { OrderService } from 'src/app/services/order.service';
import { ReceiptService } from 'src/app/services/receipt.service';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { MenuBottomComponent } from '../menu-bottom/menu-bottom.component';
import { MenuItem } from 'src/app/models/MenuItem';

@Component({
  selector: 'app-rent-history-update',
  templateUrl: './rent-history-update.component.html',
  styleUrls: ['./rent-history-update.component.scss']
})
export class RentHistoryUpdateComponent implements OnInit, OnChanges {
  @Input() receiptId!: string;
  public receipt: Receipt = <Receipt>{};
  public reservationdetail: ReservationDetail = <ReservationDetail>{};
  public formHistory!: FormGroup;
  public order!: Order;
  public room: Room = <Room>{};
  public menus: MenuItem[] = [];
  displayedColumns: string[] = ['nameItem', 'quantity', 'orderedAt', 'operation'];
  dataSource: OrderDetail[] = [];
  public total: number = 0;
  public isFormatTime: boolean = true;
  public day: number = 0;
  public isCheckDay: boolean = true;
  public lateHourCheckedIn: number = 0;
  public lateMinuteCheckedIn: number = 0;
  public lateHourCheckedOut: number = 0;
  public lateMinuteCheckedOut: number = 0;
  @Output() changeHistory = new EventEmitter();

  @ViewChild(MatTable) table!: MatTable<OrderDetail>;

  constructor(private orderService: OrderService,
    private fb: FormBuilder,
    public menuService: MenuService,
    private roomService: RoomsService,
    private receiptSerice: ReceiptService,
    private _snackBar: MatSnackBar,
    private reservationDetailService: ReservationDetailService
    ){
      this.formHistory = this.fb.group({
        dayCheckedIn: [new Date(), Validators.required],
        hourCheckedIn: ["", Validators.required],
        dayCheckedOut: [new Date(), Validators.required],
        hourCheckedOut: ["", Validators.required],
        roomPrice: [0, Validators.required],
        roomExceed: [0, Validators.required],
        prepayment: [0, Validators.required],
        priceMenu: [0, Validators.required],
        totalPrice: [0, Validators.required],
        intoMoney: [0, Validators.required],
      })
  }



  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if(changes.)
    this.setForm();
  }

  setForm() {
    this.receiptSerice.getReceiptById(this.receiptId).subscribe({
      next: next => {
        this.receipt = next;
        this.reservationDetailService.getReservationDetailById(this.receipt.reservationDetailId).subscribe({
          next: next => {
            this.reservationdetail = next;
            this.reservationdetail.checkedInAt = new Date(this.reservationdetail.checkedInAt);
            if(this.reservationdetail.checkedOutAt)
              this.reservationdetail.checkedOutAt = new Date(this.reservationdetail.checkedOutAt);
            else
            this.reservationdetail.checkedOutAt = null;
            this.roomService.getRoomById(this.reservationdetail.roomId).subscribe({
              next: next => {
                this.room = next;
                this.orderService.getOrderByReservationDetail(this.reservationdetail).subscribe(data => {
                  this.order = data[0];
                  this.convert(this.order);
                  let checkedOut = this.reservationdetail.checkedOutAt? this.reservationdetail.checkedOutAt:new Date();
                  this.DayCheckedIn?.setValue(this.reservationdetail.checkedInAt);
                  this.HourCheckedIn?.setValue(this.getHour(this.reservationdetail.checkedInAt));
                  this.DayCheckedOut?.setValue(checkedOut);
                  this.HourCheckedOut?.setValue(this.getHour(checkedOut));
                  this.dataSource = this.order.details;
                  this.configuration(this.reservationdetail.checkedInAt, checkedOut);
                });
              }
            })
          }
        })
      }
    });
    this.menuService.getMenuAll().subscribe({
      next: data => {
        this.menus = data.items;
      }
    });
  }

  convert(order: Order)
  {
    order.details.forEach(item => {
      item.orderedAt = new Date(item.orderedAt);
    })
  }

  changeDay() {
    let checkedIn = new Date(this.dayString(this.DayCheckedIn?.value) + ' ' + this.HourCheckedIn?.value + ':00');
    let checkedOut = new Date(this.dayString(this.DayCheckedOut?.value) + ' ' + this.HourCheckedOut?.value + ':00');
    this.checkDay(checkedIn, checkedOut);
    if(!this.isCheckDay) return;
    this.daysIn(checkedIn, checkedOut);
    this.setPrice(checkedIn, checkedOut);
    this.totalPrice();
  }

  changeHour() {
    if(this.forMatTime(this.HourCheckedIn?.value) && this.forMatTime(this.HourCheckedOut?.value)){
      this.isFormatTime = true;
      let checkedIn = new Date(this.dayString(this.DayCheckedIn?.value) + ' ' + this.HourCheckedIn?.value + ':00');
      let checkedOut = new Date(this.dayString(this.DayCheckedOut?.value) + ' ' + this.HourCheckedOut?.value + ':00');
      this.checkDay(checkedIn, checkedOut);
      if(!this.isCheckDay) return;
      this.hourSurchargeCheckedIn(checkedIn);
      this.hourSurchargeCheckedOut(checkedOut);
      this.daysIn(checkedIn, checkedOut);
      this.setPrice(checkedIn, checkedOut);
      this.totalPrice();
    }
    else this.isFormatTime = false;
  }

  checkDay(checkedIn: Date, checkedOut: Date){
    this.isCheckDay = (checkedOut.getTime() - checkedIn.getTime()) > 0;
  }

  dayString(date: Date): string {
    let month = date.getMonth() + 1;
    return date.getFullYear() + '-' + month + '-' + date.getDate();
  }

  configuration(checkedIn: Date, checkedOut: Date){
    this.setPrice(checkedIn, checkedOut);
    this.totalPrice();
    this.daysIn(checkedIn, checkedOut);
    this.hourSurchargeCheckedIn(checkedIn);
    this.hourSurchargeCheckedOut(checkedOut);
  }

  setPrice(checkedIn: Date, checkedOut: Date) {
    let roomP = this.reservationDetailService.getTotalRoomPrice(this.reservationdetail, checkedIn, checkedOut);
    let roomE = this.reservationDetailService.getRoomSurcharge(this.reservationdetail, this.room, checkedIn, checkedOut);
    this.RoomPrice?.setValue(roomP/1000);
    this.RoomExceed?.setValue(roomE/1000);
    this.Prepayment?.setValue(this.reservationdetail.deposit/1000);
  }

  save() {
    if(this.formHistory.valid && this.isCheckDay && this.isFormatTime) {
      let checkedIn = new Date(this.dayString(this.DayCheckedIn?.value) + ' ' + this.HourCheckedIn?.value + ':00');
      let checkedOut = new Date(this.dayString(this.DayCheckedOut?.value) + ' ' + this.HourCheckedOut?.value + ':00');
      this.reservationdetail.checkedInAt = checkedIn;
      this.reservationdetail.checkedOutAt = checkedOut;
      this.order.details = this.dataSource;
      this.receipt.orderPrice = this.total;
      this.receipt.totalPrice = this.TotalPrice?.value*1000;
      this.reservationDetailService.update(this.reservationdetail).subscribe({
        next: next => {
          this.orderService.update(this.order).subscribe({
            next: next => {
              this.receiptSerice.update( this.receipt).subscribe({
                next: next => {
                  this._snackBar.open("Trả phòng thành cồng", "",{
                    duration: 1000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                  });
                  this.changeHistory.emit();
                }
              })
            }
          })
        }
      })
    }
  }

  getHour(date: Date): string {
    return date.getHours() + ':' + date.getMinutes();
  }

  forMatTime(s: string): boolean {
    let subS = s.split(":");
    let isAllDigitsHour = /^\d+$/.test(subS[0]);
    let isAllDigitsMinute = /^\d+$/.test(subS[1]);
    if(isAllDigitsHour && parseInt(subS[0]) < 24 && isAllDigitsMinute && parseInt(subS[1]) < 60)
      return true;
    return false;
  }

  deleteOrderDetailAll() {
    this.dataSource.splice(0, this.dataSource.length);
    this.table.renderRows();
    this.totalPrice();
  }

  deleteOrderDetail(item: OrderDetail) {
    let index = this.dataSource.findIndex(each => each.itemId = item.itemId)

    this.dataSource.splice(index, 1);
    this.table.renderRows();
    this.totalPrice();
  }

  public k: number = 1;

  mousedownInputQuantity(event: Event) {
    this.k = parseInt((event.target as HTMLInputElement).value)
  }
  updateQuantity(event: Event, item: OrderDetail) {
    let t = parseInt((event.target as HTMLInputElement).value);
    if(t && t > 0){
      item.quantity = t;
      this.totalPrice();
      return;
    }
    item.quantity = this.k;
    (event.target as HTMLInputElement).value = this.k + '';
  }

  remove(item: OrderDetail) {
    if(item.quantity > 1)
    {
      item.quantity--;
      this.totalPrice();
    }
  }

  add(item: OrderDetail) {
    item.quantity ++;
    this.totalPrice();
  }

  totalPrice() {
    this.total = 0;
    this.dataSource.forEach(element => {
      this.total += element.price * element.quantity;
    });
    this.PriceMenu?.setValue(this.total/1000);
    this.setTotalPrice();
  }

  setTotalPrice() {
    let totalP = this.RoomPrice?.value*1000 + this.RoomExceed?.value*1000 + this.total;
    let intoM = totalP - this.reservationdetail.deposit;
    this.TotalPrice?.setValue(totalP/1000);
    this.IntoMoney?.setValue(intoM/1000);
  }

  daysIn(checkedIn: Date, checkedOut: Date) {
    this.day = this.reservationDetailService.daysIn(checkedIn, checkedOut);
  }

  hourSurchargeCheckedIn(checkedIn: Date) {
    this.lateHourCheckedIn = 14 - checkedIn.getHours();
    this.lateMinuteCheckedIn = 60 - checkedIn.getMinutes();
    if(this.lateMinuteCheckedIn < 60)
      this.lateHourCheckedIn--;
    else
      this.lateMinuteCheckedIn = 0;
  }

  hourSurchargeCheckedOut(checkedOut: Date) {
    this.lateHourCheckedOut = checkedOut.getHours() - 12;
    this.lateMinuteCheckedOut = checkedOut.getMinutes();
  }

  adultsExceed(): number {
    if(this.reservationdetail.totalAdults > this.room.maxAdult)
      return this.reservationdetail.totalAdults - this.room.maxAdult;
    return 0;
  }

  childrenExceed(): number {
    if(this.reservationdetail.totalChildren > this.room.maxChild)
      return this.reservationdetail.totalChildren - this.room.maxChild;
    return 0;
  }

  getNameMenu(id: string)
  {
    let item = this.menus.find(item => item.id = id);
    return item? item.name : "";
  }

  get DayCheckedIn() {
    return this.formHistory.get('dayCheckedIn');
  }

  get HourCheckedIn() {
    return this.formHistory.get('hourCheckedIn');
  }

  get DayCheckedOut() {
    return this.formHistory.get('dayCheckedOut');
  }
  get HourCheckedOut() {
    return this.formHistory.get('hourCheckedOut');
  }
  get RoomPrice() {
    return this.formHistory.get('roomPrice');
  }
  get RoomExceed() {
    return this.formHistory.get('roomExceed');
  }
  get Prepayment() {
    return this.formHistory.get('prepayment');
  }
  get PriceMenu() {
    return this.formHistory.get('priceMenu');
  }
  get TotalPrice() {
    return this.formHistory.get('totalPrice');
  }
  get IntoMoney() {
    return this.formHistory.get('intoMoney');
  }
}
