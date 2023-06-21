import { Component, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Room } from 'src/app/models/Room';
import { BookRoomDTO } from 'src/app/models/book-room-dto';
import { MergeCD } from 'src/app/models/merge-cd';
import { BookRoomDTOService } from 'src/app/services/book-room-dto.service';
import { MergeCDService } from 'src/app/services/merge-cd.service';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-book-room',
  templateUrl: './book-room.component.html',
  styleUrls: ['./book-room.component.scss'],
})
export class BookRoomComponent {
  @ViewChild('myInputFrom') myInputFromDatePicker: any;
  today!: string;
  onDateTabFirstTo(event: any) {}
  selectedRoom: number = 0;

  isEditResertationVisible: boolean = true;
  isNormalVisible: boolean = true;
  isReceiveRoomVisible: boolean = true;
  isAddReservationVisible: boolean = true;
  myDate: Date = new Date();
  onDate(event: any) {}
  checkStatusReservation(a: any) {}
  dateThird: Date = new Date();
  remove(room: any) {}

  openBottomSheet() {
    // this._bottomSheet.open(BottomSheetOverviewExampleSheetComponent);
  }
  selectedDateFirstTab: Date = new Date();
  dateEnd: Date = new Date(
    this.selectedDateFirstTab.getTime() + 6 * 24 * 60 * 60 * 1000
  );
  public bookRoomDtos: BookRoomDTO[] = [];
  public mergeCDs: MergeCD[] = [];
  public rooms: Room[] = [];

  constructor(
    private bookRoomDtosService: BookRoomDTOService,
    private mergeCDService: MergeCDService,
    private roomService: RoomsService
  ) {
    this.today = this.getTodayDateString();
    this.handlePullCalendar();

    roomService.uploadRoomAll();
  }
  ngOnInit() {
    this.today = new Date().toISOString().split('T')[0];
  }

  handlePullCalendar() {
    this.roomService.rooms$.subscribe({
      next: (next) => {
        this.rooms = next;
        this.bookRoomDtosService
          .getBookRoomDtos(
            this.selectedDateFirstTab.toISOString(),
            this.dateEnd.toISOString(),
            true,
            true
          )
          .subscribe({
            next: (next) => {
              this.bookRoomDtos = next;

              this.mergeCDService
                .getMergeCD(
                  this.selectedDateFirstTab.toISOString(),
                  this.dateEnd.toISOString()
                )
                .subscribe({
                  next: (next) => {
                    this.mergeCDs = next;
                  },
                });
            },
          });
      },
    });
  }

  onDateTabFirstFrom() {
    this.dateEnd.setTime(
      this.selectedDateFirstTab.getTime() + 6 * 24 * 60 * 60 * 1000
    );
    this.handlePullCalendar();
  }
  getNextSixDays(startDate: Date): Date[] {
    const nextSixDays: Date[] = [];
    for (let i = 0; i < 6; i++) {
      const nextDay = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      nextSixDays.push(nextDay);
    }
    return nextSixDays;
  }

  //xử lí tang giam ngay
  getTodayDateString(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }
  decreaseDate() {
    const currentDate = new Date(this.today);
    currentDate.setDate(currentDate.getDate() - 1);
    this.today = currentDate.toISOString().split('T')[0];
  }

  increaseDate() {
    const currentDate = new Date(this.today);
    currentDate.setDate(currentDate.getDate() + 1);
    this.today = currentDate.toISOString().split('T')[0];
  }

  countleft(date: Date) {
    date = new Date(date);

    if (date < this.selectedDateFirstTab) return '110px';
    let t =
      ((date.getTime() - this.selectedDateFirstTab.getTime()) /
        (1000 * 60 * 60 * 24)) *
        110 +
      110 / 2;
    return t + 'px';
  }
  countWidth(reservedAt: Date, reservedOut: Date) {
    console.log
    if(!reservedOut) reservedOut = new Date;
    reservedAt = new Date(reservedAt);
    reservedOut = new Date(reservedOut);
    if (reservedAt < this.selectedDateFirstTab)
      reservedAt = this.selectedDateFirstTab;
    if (reservedOut >= this.selectedDateFirstTab) reservedOut = this.dateEnd;
    let t =
      (Math.floor(
        (reservedOut.getTime() - reservedAt.getTime()) / (1000 * 60 * 60 * 24)
      ) +
        1) *
        110 -
      55;
      if(t < 0) t = 110;
    return t + 'px';
  }
  ///show component
  showComponentAddReservation: boolean = false;
  componentAddReservation() {
    this.showComponentAddReservation = !this.showComponentAddReservation;
  }
  showComponentAddPerson: boolean = false;
  openAddPerson() {
    this.showComponentAddPerson = !this.showComponentAddPerson;
  }

  showComponentEditReservation: boolean = false;
}
