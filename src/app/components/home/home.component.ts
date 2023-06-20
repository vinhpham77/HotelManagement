import { Component, OnInit } from '@angular/core';
import { RoomsService } from '../../services/rooms.service';
import { Room } from '../../models/Room';
import { Subscription } from 'rxjs';
import { ReservationDetailService } from '../../services/reservation-detail.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  rooms: Room[] = [];
  emptyCount: number = 0;
  filledCount: number = 0;
  notCleanedCount: number = 0;
  weekStart: Date = new Date();
  weekEnd: Date = new Date();
  rentCountThisWeek: number = 0;
  subscriptions: Subscription[] = [];

  constructor(private roomService: RoomsService, private reservationDetailService: ReservationDetailService) {
    const roomsSub = this.roomService.rooms$.subscribe(data => {
      this.rooms = data;
      this.loadMetrics();
    });

    this.setWeekStartAndWeekEnd();

    const reservationDetailSub = this.reservationDetailService.getReservationDetailCount(this.weekStart, this.weekEnd).subscribe(data => {
      this.rentCountThisWeek = data;
    });

    this.subscriptions.push(roomsSub);
  }

  ngOnInit(): void {
    this.roomService.uploadRoomAll();
  }

  loadMetrics() {
    this.rooms.forEach(room => {
      if (room.isEmpty) {
        this.emptyCount++;
      } else {
        this.filledCount++;
      }

      if (!room.isCleaned) {
        this.notCleanedCount++;
      }
    });
  }

  setWeekStartAndWeekEnd() {
    const currentDate = new Date();

    this.weekStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - ((currentDate.getDay() || 7) - 1)
    );

    this.weekEnd = new Date(
      this.weekStart.getFullYear(),
      this.weekStart.getMonth(),
      this.weekStart.getDate() + 6
    );
  }
}
