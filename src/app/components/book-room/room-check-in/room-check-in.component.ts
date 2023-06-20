import { Reservation } from './../../../models/reservation';
import { Room } from './../../../models/Room';
import { ReservationDetail } from './../../../models/ReservationDetail';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoomType } from 'src/app/models/RoomType';
import { OrderService } from 'src/app/services/order.service';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { RoomTypesService } from 'src/app/services/room-types.service';
import { RoomsService } from 'src/app/services/rooms.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-room-check-in',
  templateUrl: './room-check-in.component.html',
  styleUrls: ['./room-check-in.component.scss']
})
export class RoomCheckInComponent implements OnChanges{
  @Input() reservationId!: string;
  public reservation: Reservation = <Reservation> {};
  public roomTypes: RoomType[] = [];
  public rooms: Room[] = [];
  public checkInForm!: FormGroup;
  public formCheckIn = false;
  public roomSelect: Room = <Room>{};

  constructor(private roomTypeService: RoomTypesService,
    private reservationDetailService: ReservationDetailService,
    private reservationService: ReservationService,
    private orderService: OrderService,
    private roomService: RoomsService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder) {
      this.checkInForm = this.fb.group({
        totalAdults: [null, [Validators.required, Validators.min(0)]],
        totalChildren: [null, [Validators.required, Validators.min(0)]],
        deposit: [0, [Validators.required, Validators.min(0)]]
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setForm();
  }

  setForm() {
    this.roomTypeService.getRoomTypeAll().subscribe({next: data => {
      this.roomTypes = data.items;
    },
      error: err => {}
    });
    this.roomService.getRoom().subscribe({next: data => {
      this.convert(data.items);
      this.rooms = data.items;
    },
      error: err => {}
    });
    this.reservationService.getReservationById(this.reservationId).subscribe({
      next: next => {
        this.reservation = next;
      }
    })
  }

  convert(data: Room[]) {
    data.forEach(room => {
      room.lastCleanedAt = new Date(room.lastCleanedAt);
    });
  }

  showFormCheckIn(room: Room) {
    this.roomSelect = room;
    this.formCheckIn = true;
  }

  hideFormChechIn(){
    this.formCheckIn = false;
  }

  createReservationDetail() {
    if(this.checkInForm.valid)
    {
      var reservationDetail: ReservationDetail = <ReservationDetail>{
        reservationId: this.reservation.id,
        roomId: this.roomSelect.id,
        checkedInAt: new Date(),
        checkedOutAt: null,
        deposit: this.Deposit?.value*1000,
        totalAdults: this.TotalAdults?.value,
        totalChildren: this.TotalChildren?.value,
        roomPricePerDay: this.roomSelect.pricePerDay,
        customerId: this.reservation.customerId
      }
      this.roomSelect.isEmpty = false;
      this.reservationDetailService.create(reservationDetail).subscribe({
        next: next=> {
          this.reservationDetailService.getReservationDetail(this.roomSelect.id).subscribe({
            next: next => {
              var order: Order = <Order><unknown>{
                reservationDetailId: next.items[0].id,
                details: []
              };
              this.orderService.create(order).subscribe({
                next: next => {
                  this.roomService.update(this.roomSelect).subscribe({
                    next: next => {
                      this._snackBar.open("Đặt phòng thành cồng", "",{
                        duration: 1000,
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                      });

                      this.roomService.uploadRoomAll();
                      this.reservationDetailService.uploadReservationDetailAll();
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

  get TotalAdults() {
    return this.checkInForm.get('totalAdults');
  }
  get TotalChildren() {
    return this.checkInForm.get('totalChildren');
  }

  get Deposit() {
    return this.checkInForm.get('deposit');
  }
}
