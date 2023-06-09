import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table';
import { Room } from 'src/app/models/Room';
import { Order } from 'src/app/models/order';
import { OrderDetail } from 'src/app/models/order-detail';
import { ReservationDetail } from 'src/app/models/ReservationDetail';
import { MenuService } from 'src/app/services/menu.service';
import { OrderService } from 'src/app/services/order.service';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { MenuBottomComponent } from '../menu-bottom/menu-bottom.component';
import { MenuItem } from 'src/app/models/MenuItem';

@Component({
  selector: 'app-rent-update',
  templateUrl: './rent-update.component.html',
  styleUrls: ['./rent-update.component.scss']
})
export class RentUpdateComponent implements OnInit, OnChanges{
  @Input() roomId!: string;
  public room: Room = <Room>{};
  public reservationdetail!: ReservationDetail;
  public order!: Order;
  public menus: MenuItem[] = [];
  public rentChangeForm!: FormGroup;
  displayedColumns: string[] = ['nameItem', 'quantity', 'price', 'operation'];
  dataSource: OrderDetail[] = [];
  public total = 0;
  public isFormatTime: boolean = true;
  @Output() updateRoom = new EventEmitter();

  @ViewChild(MatTable) table!: MatTable<OrderDetail>;

  constructor(private roomService: RoomsService,
    private fb: FormBuilder,
    private orderService: OrderService,
    public menuService: MenuService,
    private _bottomSheet: MatBottomSheet,
    private reservationdetailService: ReservationDetailService,
    private _snackBar: MatSnackBar) {
      this.rentChangeForm = this.fb.group({
        dayCheckedIn: [null, Validators.required],
        hourCheckedIn: [null, Validators.required],
        deposit: [null, [Validators.required, Validators.min(0)]],
      })
  }

  ngOnInit(): void {
    this.setForm()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setForm();
  }

  setForm() {
    this.roomService.getRoomById(this.roomId).subscribe({
      next: next => {
        this.room = next;
      },
      error: err => {}
    })
    this.reservationdetailService.getReservationDetail(this.roomId).subscribe({
      next: next => {
        this.reservationdetail = next.items[0];
        this.reservationdetail.checkedInAt = new Date(this.reservationdetail.checkedInAt);
        this.reservationdetail.checkedOutAt = null;
        this.DayCheckedIn?.setValue(this.reservationdetail.checkedInAt);
        this.HourCheckedIn?.setValue(this.getHourse(this.reservationdetail.checkedInAt));
        this.Deposit?.setValue(this.reservationdetail.deposit/1000);
        this.orderService.getOrderByReservationDetail(this.reservationdetail).subscribe(data => {
          this.order = data;
          this.dataSource = data.details;
          this.totalPrice();
        });
      },
      error: err => {}
    })
    this.menuService.getMenuAll().subscribe({
      next: data => {
        console.log(data.items)
        this.menus = data.items;
      }
    });
    // this.roomTypeService.roomTypesSource$.subscribe(data => this.rob
  }

  save() {
    this.isFormatTime = this.forMatTime(this.HourCheckedIn?.value);
    if(this.rentChangeForm.valid && this.isFormatTime) {
      let t = new Date(this.dayString(this.DayCheckedIn?.value) + ' ' + this.HourCheckedIn?.value + ':00');
      this.reservationdetail.checkedInAt = t;
      this.reservationdetail.deposit = this.Deposit?.value*1000;
      this.order.details = this.dataSource;
      this.reservationdetailService.update(this.reservationdetail).subscribe({
        next: next => {
          this.orderService.update(this.order).subscribe({
            next: next => {
              this._snackBar.open("Chỉnh sủa thành cồng", "",{
                duration: 1000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
              });
              this.updateRoom.emit();
            }
          })
        }
      });

    }
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

  getHourse(date: Date): string {
    return date.getHours() + ':' + date.getMinutes();
  }

  openBottomSheet(): void {
    this._bottomSheet.open(MenuBottomComponent,{
      data: this.order,
    }).afterDismissed().subscribe(result => {
      let t = new Date();
      console.log(result);
      this.dataSource.push(<OrderDetail>{
        itemId: result.id,
        quantity: 1,
        price: result.exportPrice,
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
  }

  dayString(date: Date): string {
    let month = date.getMonth() + 1;
    return date.getFullYear() + '-' + month + '-' + date.getDate();
  }

  forMatTime(s: string): boolean {
    let subS = s.split(":");

    let isAllDigitsHourse = /^\d+$/.test(subS[0]);
    let isAllDigitsMinute = /^\d+$/.test(subS[1]);
    if(isAllDigitsHourse && parseInt(subS[0]) < 24 && isAllDigitsMinute && parseInt(subS[1]) < 60)
      return true;
    return false;
  }
  getNameMenu(id: string)
  {
    let item = this.menus.find(item => item.id = id);
    return item? item.name : "";
  }

  get DayCheckedIn(){ return this.rentChangeForm.get('dayCheckedIn')}

  get HourCheckedIn(){ return this.rentChangeForm.get('hourCheckedIn')}

  get Deposit(){ return this.rentChangeForm.get('deposit')}
}
