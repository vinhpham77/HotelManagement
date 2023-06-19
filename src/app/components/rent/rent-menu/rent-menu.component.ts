import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Room } from 'src/app/models/Room';
import { Order } from 'src/app/models/order';
import { MenuService } from 'src/app/services/menu.service';
import { OrderService } from 'src/app/services/order.service';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { RoomsService } from 'src/app/services/rooms.service';

interface menuOrder {
  id: string;
  name: string;
  type: boolean | null;
  importPrice: number;
  exportPrice: number;
  quantity: number;
}

@Component({
  selector: 'app-rent-menu',
  templateUrl: './rent-menu.component.html',
  styleUrls: ['./rent-menu.component.scss']
})
export class RentMenuComponent implements OnInit, OnChanges {
  @Input() roomId!: string;
  public order: Order = <Order>{};
  public room: Room = <Room>{};
  public menus: menuOrder[] = [];
  public keyword: string = '';
  @Output() orderSave = new EventEmitter();

  constructor(private menuService: MenuService,
    private orderService: OrderService,
    private roomService: RoomsService,
    private reservationdetailService: ReservationDetailService,
    private _snackBar: MatSnackBar) {
    this.menuService.menu$.subscribe(data => {
      this.menus = [];
      data.forEach(each => this.menus.push({...each, quantity: 0}));
    });
    this.loadMenu();
  }

  ngOnInit(): void {
  }

  loadMenu() {
    let query = `keyword=${this.keyword}`
    this.menuService.loadByQuery(query);
  }

  ngOnChanges() {
    this.setData();
  }

  setData() {
    this.roomService.getRoomById(this.roomId).subscribe({
      next: next => {this.room = next},
      error: err => {}
    })
    this.reservationdetailService.getReservationDetail(this.roomId).subscribe({
      next: next => {
        this.orderService.getOrderByReservationDetail(next.items[0]).subscribe({
          next: next => {this.order = next},
          error: err => {}
        })
      }
    })
  }

  keyup() {
    this.loadMenu();
  }

  remove(item: menuOrder) {
    if(item.quantity > 0)
      item.quantity--;
  }

  add(item: menuOrder, quantity: number) {
    item.quantity += quantity;
  }

  save() {
    this.menus.forEach(item => {
      if(item.quantity > 0) {
        let detail = this.order.details.find(each => each.itemId == item.id);
        if(detail){
          detail.quantity += item.quantity;
        }
        else {
          this.order.details.push({
            itemId: item.id,
            quantity: item.quantity,
            price: item.exportPrice,
            orderedAt: new Date(),
          })
        }
      }
    })
    this.orderService.update(this.order).subscribe({
      next: next => {
        this._snackBar.open("Chỉnh sủa thành cồng", "",{
          duration: 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.orderSave.emit();
      }
    })
  }
}
