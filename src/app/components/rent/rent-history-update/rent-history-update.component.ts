import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { Room } from 'src/app/models/Room';
import { Order } from 'src/app/models/order';
import { OrderDetail } from 'src/app/models/order-detail';
import { Receipt } from 'src/app/models/receipt';
import { ReservationDetail } from 'src/app/models/reservation-detail';
import { MenuService } from 'src/app/services/menu.service';
import { OrderService } from 'src/app/services/order.service';
import { ReceiptService } from 'src/app/services/receipt.service';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { MenuComponent } from '../menu/menu.component';
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
  displayedColumns: string[] = ['nameItem', 'quantity', 'price', 'operation'];
  dataSource: OrderDetail[] = [];
  public total: number = 0;
  public isFormatTime: boolean = true;
  public day: number = 0;
  public isCheckDay: boolean = true;
  public lateHourseCheckIn: number = 0;
  public lateMinuteCheckIn: number = 0;
  public lateHourseCheckOut: number = 0;
  public lateMinuteCheckOut: number = 0;
  @Output() changeHistory = new EventEmitter();

  @ViewChild(MatTable) table!: MatTable<OrderDetail>;

  constructor(private orderService: OrderService,
    private fb: FormBuilder,
    public menuService: MenuService, 
    private _bottomSheet: MatBottomSheet,
    private roomService: RoomsService,
    private receiptSerice: ReceiptService,
    private _snackBar: MatSnackBar,
    private reservationDetailService: ReservationDetailService
    ){
      this.formHistory = this.fb.group({
        dayCheckIn: [new Date(), Validators.required],
        hourseCheckIn: ["", Validators.required],
        dayCheckOut: [new Date(), Validators.required],
        hourseCheckOut: ["", Validators.required],
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
            this.reservationdetail.checkInAt = new Date(this.reservationdetail.checkInAt);
            if(this.reservationdetail.checkOutAt)
              this.reservationdetail.checkOutAt = new Date(this.reservationdetail.checkOutAt);
            else
            this.reservationdetail.checkOutAt = null;
            this.roomService.getRoomById(this.reservationdetail.roomId).subscribe({
              next: next => {
                this.room = next;
                this.orderService.getOrderByReservationDetail(this.reservationdetail).subscribe(data => {
                  this.order = data[0];
                  let checkOut = this.reservationdetail.checkOutAt? this.reservationdetail.checkOutAt:new Date();
                  this.DayCheckIn?.setValue(this.reservationdetail.checkInAt);
                  this.HourseCheckIn?.setValue(this.getHourse(this.reservationdetail.checkInAt));
                  this.DayCheckOut?.setValue(checkOut);
                  this.HourseCheckOut?.setValue(this.getHourse(checkOut));
                  this.dataSource = this.order.details;
                  this.configuration(this.reservationdetail.checkInAt, checkOut);
                });
              }
            })
          }
        })
      }
    });
    this.menuService.menu$.subscribe({
      next: data => {
        this.menus = data;
      }
    });
    this.menuService.uploadMenuAll();
  }

  changeDay() {
    let checkIn = new Date(this.dayString(this.DayCheckIn?.value) + ' ' + this.HourseCheckIn?.value + ':00');
    let checkOut = new Date(this.dayString(this.DayCheckOut?.value) + ' ' + this.HourseCheckOut?.value + ':00');
    this.checkDay(checkIn, checkOut);
    if(!this.isCheckDay) return;
    this.daysIn(checkIn, checkOut);
    this.setPrice(checkIn, checkOut);
    this.totalPrice();
  }

  changeHourse() {
    if(this.forMatTime(this.HourseCheckIn?.value) && this.forMatTime(this.HourseCheckOut?.value)){
      this.isFormatTime = true;
      let checkIn = new Date(this.dayString(this.DayCheckIn?.value) + ' ' + this.HourseCheckIn?.value + ':00');
      let checkOut = new Date(this.dayString(this.DayCheckOut?.value) + ' ' + this.HourseCheckOut?.value + ':00');
      this.checkDay(checkIn, checkOut);
      if(!this.isCheckDay) return;
      this.hourseSurchargeCheckIn(checkIn);
      this.hourseSurchargeCheckOut(checkOut);
      this.daysIn(checkIn, checkOut);
      this.setPrice(checkIn, checkOut);
      this.totalPrice();
    }
    else this.isFormatTime = false;
  }

  checkDay(checkIn: Date, checkOut: Date){
    this.isCheckDay = (checkOut.getTime() - checkIn.getTime()) > 0;
  }

  dayString(date: Date): string {
    let month = date.getMonth() + 1;
    return date.getFullYear() + '-' + month + '-' + date.getDate();
  }

  configuration(checkIn: Date, checkOut: Date){
    this.setPrice(checkIn, checkOut);
    this.totalPrice();
    this.daysIn(checkIn, checkOut);
    this.hourseSurchargeCheckIn(checkIn);
    this.hourseSurchargeCheckOut(checkOut);
    
  }

  setPrice(checkIn: Date, checkOut: Date) {
    let roomP = this.reservationDetailService.roomPriceDay(this.reservationdetail, checkIn, checkOut);
    let roomE = this.reservationDetailService.roomSurcharge(this.reservationdetail, this.room, checkIn, checkOut);
    this.RoomPrice?.setValue(roomP/1000);
    this.RoomExceed?.setValue(roomE/1000);
    this.Prepayment?.setValue(this.reservationdetail.deposits/1000);
  }

  check() {
    // if(this.formCheckIn.valid) {
    //   let receipt: Receipt = <Receipt>{
    //     employeeId: "luong",
    //     reservationDetailId: this.reservationdetail.id,
    //     createdAt: this.checkOut,
    //     orderPrice: this.total,
    //     roomPrice: this.TotalPrice?.value*1000,
    //   }
    //   let update = {
    //     checkOutAt: this.checkOut
    //   }
    //   this.receiptSerice.createReceipt(receipt).subscribe({
    //     next: next => {
    //       this.reservationDetailService.upDate(this.reservationdetail, update).subscribe({
    //         next: next => {
    //           this.orderService.updateDetail(this.order, this.dataSource).subscribe({
    //             next: next => {
    //               this.roomService.changeStatus(this.room).subscribe({
    //                 next: next => {
    //                   this._snackBar.open("Trả phòng thành cồng", "",{
    //                     duration: 1000,
    //                     horizontalPosition: 'right',
    //                     verticalPosition: 'top',
    //                   });
    //                   this.checkRoom.emit();
    //                 }
    //               })
    //             }
    //           })
    //         }
    //       })
    //     }
    //   })
    // }
  }

  delete() {
  }

  save() {
    if(this.formHistory.valid && this.isCheckDay && this.isFormatTime) {
      let checkIn = new Date(this.dayString(this.DayCheckIn?.value) + ' ' + this.HourseCheckIn?.value + ':00');
      let checkOut = new Date(this.dayString(this.DayCheckOut?.value) + ' ' + this.HourseCheckOut?.value + ':00');
      this.reservationdetail.checkInAt = checkIn;
      this.reservationdetail.checkOutAt = checkOut;
      this.order.details = this.dataSource;
      this.receipt.orderPrice = this.total;
      this.receipt.roomPrice = this.TotalPrice?.value*1000;
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

  getHourse(date: Date): string {
    return date.getHours() + ':' + date.getMinutes();
  }

  forMatTime(s: string): boolean {
    let subS = s.split(":");
    if(subS.length == 2 && parseInt(subS[0]) < 24 && parseInt(subS[1]) < 60)
      return true;
    return false;
  }

  openBottomSheet(): void {
    this._bottomSheet.open(MenuComponent,{
      data: this.order,
    }).afterDismissed().subscribe(result => {
      let t = new Date();
      this.dataSource.push(<OrderDetail>{
        itemId: result.id,
        quantity: 1,
        price: result.price,
        orderedAt: t,
      })
      this.table.renderRows();
      this.totalPrice();
    })
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
    let intoM = totalP - this.reservationdetail.deposits;
    this.TotalPrice?.setValue(totalP/1000);
    this.IntoMoney?.setValue(intoM/1000);
  }

  daysIn(checkIn: Date, checkOut: Date) {
    this.day = this.reservationDetailService.daysIn(checkIn, checkOut);
    console.log(this.day);
  }

  hourseSurchargeCheckIn(checkIn: Date) {
    this.lateHourseCheckIn = 12 - checkIn.getHours();
    this.lateMinuteCheckIn = 60 - checkIn.getMinutes();
    if(this.lateMinuteCheckIn < 60)
      this.lateHourseCheckIn--;
    else
      this.lateMinuteCheckIn = 0;
  }

  hourseSurchargeCheckOut(checkOut: Date) {
    this.lateHourseCheckOut = checkOut.getHours() - 12;
    this.lateMinuteCheckOut = checkOut.getMinutes();
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

  get DayCheckIn() {
    return this.formHistory.get('dayCheckIn');
  }

  get HourseCheckIn() {
    return this.formHistory.get('hourseCheckIn');
  }

  get DayCheckOut() {
    return this.formHistory.get('dayCheckOut');
  }
  get HourseCheckOut() {
    return this.formHistory.get('hourseCheckOut');
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
