import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Room } from 'src/app/models/Room';
import { RoomType } from 'src/app/models/RoomType';
import { ReservationDetail } from 'src/app/models/reservation-detail';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { RoomTypesService } from 'src/app/services/room-types.service';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-rent-change-room',
  templateUrl: './rent-change-room.component.html',
  styleUrls: ['./rent-change-room.component.scss']
})
export class RentChangeRoomComponent implements OnInit, OnChanges {
  @Input() roomId!: string;
  public reservationdetail: ReservationDetail = <ReservationDetail>{};
  public roomTypes: RoomType[] = [];
  public rooms: Room[] = [];
  public roomChange: Room = <Room>{};
  @Output() change = new EventEmitter();

  constructor(private roomTypeService: RoomTypesService,
    private roomService: RoomsService,
    private reservationDetailService: ReservationDetailService,
    private _snackBar: MatSnackBar
    ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setForm();
  }

  setForm() {
    this.roomTypeService.roomTypes$.subscribe({next: data => this.roomTypes = data,
      error: err => {}
    });
    this.roomTypeService.uploadRoomTypeAll();
    this.roomService.rooms$.subscribe({next: data => this.rooms = data,
      error: err => {}
    });
    this.roomService.uploadRoomAll();
    this.roomService.getRoomById(this.roomId).subscribe({
      next: next => {this.roomChange = next},
      error: err => {}
    })

    this.reservationDetailService.getReservationDetail(this.roomId).subscribe({
      next: next => {this.reservationdetail = next[0];
        this.reservationdetail.checkInAt = new Date(this.reservationdetail.checkInAt);
        this.reservationdetail.checkOutAt = null;
      },
      error: err => {}
    })
  }

  changeRoom(room: Room) {
    this.reservationdetail.roomId = room.id;
    room.isEmpty = !room.isEmpty;
    this.roomChange.isEmpty = !this.roomChange.isEmpty;
    this.reservationDetailService.update(this.reservationdetail).subscribe({
      next: next => {
        this.roomService.update(room).subscribe({
          next: next => {
            this.roomService.update(this.roomChange).subscribe({
              next: next => {
                this._snackBar.open("Đổi phòng thành cồng", "",{
                  duration: 1000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                });
                this.change.emit();
              }
            })
          }
        })
      },
      error: error => {}
    })
  }

  changeAndCleanRoom(room: Room) {
    this.reservationdetail.roomId = room.id;
    room.isEmpty = !room.isEmpty;
    this.roomChange.isEmpty = !this.roomChange.isEmpty;
    this.roomChange.isCleaned = !this.roomChange.isCleaned;
    this.roomChange.lastCleanedAt = new Date();
    this.reservationDetailService.update(this.reservationdetail).subscribe({
      next: next => {
        this.roomService.update(room).subscribe({
          next: next => {
            this.roomService.update(this.roomChange).subscribe({
              next: next => {
                this._snackBar.open("Đổi phòng thành cồng", "",{
                  duration: 1000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                });
                this.change.emit();
              }
            })
          }
        })
      },
      error: error => {}
    })
  }
}
