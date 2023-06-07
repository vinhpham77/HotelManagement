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
import { MenuBottomComponent } from '../menu-bottom/menu-bottom.component';
import { MenuItem } from 'src/app/models/MenuItem';

@Component({
  selector: 'app-rent-check-out',
  templateUrl: './rent-check-out.component.html',
  styleUrls: ['./rent-check-out.component.scss']
})
export class RentCheckedOutComponent implements OnInit, OnChanges {
  @Input() roomId!: string;
  public reservationdetail: ReservationDetail = <ReservationDetail>{};
  public formCheckedIn!: FormGroup;
  public order: Order = <Order>{};
  public room: Room = <Room>{};
  public menus: MenuItem[] = [];
  displayedColumns: string[] = ['nameItem', 'quantity', 'price', 'operation'];
  dataSource: OrderDetail[] = [];
  public total: number = 0;
  @Input() checkedOut!: Date;
  @Output() checkRoom = new EventEmitter();

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
      this.formCheckedIn = this.fb.group({
        dayCheckedIn: [new Date(), Validators.required],
        hourCheckedIn: ["", Validators.required],
        dayCheckedOut: [new Date(), Validators.required],
        hourseCheckedOut: ["", Validators.required],
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
    this.setForm();
  }

  setForm() {

    this.roomService.getRoomById(this.roomId).subscribe({
      next: next => {
        this.room = next;
        this.reservationDetailService.getReservationDetail(this.roomId).subscribe({
          next: next => {
            this.reservationdetail = next.items[0];
            this.reservationdetail.checkedInAt = new Date(this.reservationdetail.checkedInAt);
            this.reservationdetail.checkedOutAt = null;
            this.orderService.getOrderByReservationDetail(this.reservationdetail).subscribe({next: data => {
              this.order = data[0];
              this.configuration();
            },
            error: err => {}
          });
          },
          error: err => {}
        })
      },
      error: err => {}
    })

    this.menuService.getMenuAll().subscribe({
      next: data => {
        this.menus = data.items;
      }
    });
  }

  configuration(){
    let roomP = this.reservationDetailService.roomPriceDay(this.reservationdetail, this.reservationdetail.checkedInAt, this.checkedOut);
    let roomE = this.reservationDetailService.roomSurcharge(this.reservationdetail, this.room, this.reservationdetail.checkedInAt, this.checkedOut);
    this.DayCheckedIn?.setValue(this.reservationdetail.checkedInAt);
    this.HourseCheckedIn?.setValue(this.getHourse(this.reservationdetail.checkedInAt));
    this.DayCheckedOut?.setValue(this.checkedOut);
    this.HourCheckedOut?.setValue(this.getHourse(this.checkedOut));
    this.RoomPrice?.setValue(roomP/1000);
    this.RoomExceed?.setValue(roomE/1000);
    this.Prepayment?.setValue(this.reservationdetail.deposit/1000);
    this.dataSource = this.order.details;
    this.totalPrice();
  }

  check() {
    if(this.formCheckedIn.valid) {
      let receipt: Receipt = <Receipt>{
        personnelId: "luong",
        reservationDetailId: this.reservationdetail.id,
        createdAt: this.checkedOut,
        orderPrice: this.total,
        roomPrice: this.TotalPrice?.value*1000,
      }
      let update = {
        checkedOutAt: this.checkedOut
      }
      this.reservationdetail.checkedOutAt = this.checkedOut;
      this.order.details = this.dataSource;
      this.room.isEmpty = !this.room.isEmpty;
      this.receiptSerice.create(receipt).subscribe({
        next: next => {
          this.reservationDetailService.update(this.reservationdetail).subscribe({
            next: next => {
              this.orderService.update(this.order).subscribe({
                next: next => {
                  this.roomService.update(this.room).subscribe({
                    next: next => {
                      this._snackBar.open("Trả phòng thành cồng", "",{
                        duration: 1000,
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                      });
                      this.checkRoom.emit();
                    }
                  })
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

  openBottomSheet(): void {
    this._bottomSheet.open(MenuBottomComponent,{
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

  getNameMenu(id: string)
  {
    let item = this.menus.find(item => item.id = id);
    return item? item.name : "";
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
    let totalP = this.RoomPrice?.value*1000 + this.RoomExceed?.value*1000 + this.total;
    let intoM = totalP - this.reservationdetail.deposit;
    this.PriceMenu?.setValue(this.total/1000);
    this.TotalPrice?.setValue(totalP/1000);
    this.IntoMoney?.setValue(intoM/1000);
  }

  daysIn(): number {
    return this.reservationDetailService.daysIn(this.reservationdetail.checkedInAt, this.checkedOut);
  }

  isSurchargeCheckedIn(): boolean {
    if(!this.reservationdetail.checkedInAt) return false;
    var t = this.reservationdetail.checkedInAt.getHours();
    if(t >= 12)
      return false;
    return true
  }

  isSurchargeCheckedOut(): boolean {
    var t = this.checkedOut.getHours();
    if(t >= 12)
      return  true;
    return false;
  }

  hourseSurchargeCheckedIn(): string {
    var t = 12 - this.reservationdetail.checkedInAt.getHours();
    var h = 60 - this.reservationdetail.checkedInAt.getMinutes();
    if(h < 60)
      t--;
    else
      h = 0;
    return t + ' Giờ ' + h + ' Phút';
  }

  hourseSurchargeCheckedOut(): string {
    var t = this.checkedOut.getHours() - 12;
    var h = this.checkedOut.getMinutes();
    return t + ' Giờ ' + h + ' Phút';
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

  get DayCheckedIn() {
    return this.formCheckedIn.get('dayCheckedIn');
  }

  get HourseCheckedIn() {
    return this.formCheckedIn.get('hourseCheckedIn');
  }

  get DayCheckedOut() {
    return this.formCheckedIn.get('dayCheckedOut');
  }
  get HourCheckedOut() {
    return this.formCheckedIn.get('hourseCheckedOut');
  }
  get RoomPrice() {
    return this.formCheckedIn.get('roomPrice');
  }
  get RoomExceed() {
    return this.formCheckedIn.get('roomExceed');
  }
  get Prepayment() {
    return this.formCheckedIn.get('prepayment');
  }
  get PriceMenu() {
    return this.formCheckedIn.get('priceMenu');
  }
  get TotalPrice() {
    return this.formCheckedIn.get('totalPrice');
  }
  get IntoMoney() {
    return this.formCheckedIn.get('intoMoney');
  }
}

