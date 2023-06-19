import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Room } from 'src/app/models/Room';
import { RoomsService } from 'src/app/services/rooms.service';
import { ReservationService } from 'src/app/services/reservation.service';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { Reservation } from 'src/app/models/reservation';
import { Customer } from 'src/app/models/Customer';
import { CustomersService } from 'src/app/services/customers.service';
import { ReservationDetail } from 'src/app/models/ReservationDetail';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-info-person-bookroom',
  templateUrl: './info-person-bookroom.component.html',
  styleUrls: ['./info-person-bookroom.component.css']
})
export class InfoPersonBookroomComponent implements OnChanges {
  @Input() room!: Room;
  @Input() date!: Date;
  public dateEnd: Date = new Date;
  // private reServations!: Reservation[];
  public arrayReServations: Reservation[] = []
  public reServation!: Reservation;
  public reservationDetail!: ReservationDetail;

  public newDate:Date=new Date();
  public getCheckin!: Date;
  public getCheckout!: Date;
  public name!: string;
  public cus: Customer[]=[];

  constructor(private reServationService: ReservationService,
    private reServationDetailService: ReservationDetailService,
    private roomService: RoomsService,
    private customerSevice: CustomersService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.date && this.room) {
      this.dateEnd.setTime(this.date.getTime() + 6 * 24 * 60 * 60 * 1000);
      // this.reServationService.getReservation().subscribe((data) => { this.convertReser(data); this.checkStatus(data);
      //       this.customerSevice.getCustomers().subscribe((cus)=>{
      //         this.cus = cus;
      //       })
      //    });
    }
  }

  findName(customerId: string): string {
    let k = this.cus.find(each => each.id == customerId)?.firstName;
    if(k) return k;
    return '';
  }

  showEditResertationVisible() { }
  showReceiveRoomVisible() { }
  // checkStatus(reservationList: Reservation[]) {
  //   if (this.room.status == true) {
  //     this.reServationDetailService.getCheckReservationDetails(this.room).subscribe((detailreser) => {
  //       this.convert(detailreser);
  //       if (detailreser.length > 0 && (detailreser[0].checkInAt.getTime() < this.dateEnd.getTime() && this.newDate.getTime() >= this.date.getTime())) {
  //         this.reservationDetail = detailreser[0];
  //       }
  //     })
  //   }
  //   reservationList.forEach(each => {
  //     if (this.isExistRoomId(each.roomIds) && (this.checkDate(each.reservedAt) || this.checkDate(each.reservedOut))) {
  //       this.havedetailId(each);
  //     }
  //   })
  // }

  countleft(date: Date) {
    if(date < this.date) return '110px';
    let t = ((date.getTime() - this.date.getTime()) / (1000 * 60 * 60 * 24)) * 110 + 110 + 110 / 2;
    return t + "px";
  }
  countWidth(reservedAt: Date, reservedOut: Date) {
    if(reservedAt < this.date) reservedAt = this.date;
    if(reservedOut >= this.dateEnd) reservedOut = this.dateEnd;
    let t = (Math.floor((reservedOut.getTime() - reservedAt.getTime()) / (1000 * 60 * 60 * 24)) + 1) * 110 - 55;
    return t + "px";
  }
  isExistRoomId(roomIdList: string[]) {
    return roomIdList.find(each => each == this.room.id) ? true : false;
  }
  // convert(data: ReservationDetail[]) {
  //   data.forEach(each => {
  //     each.checkInAt = new Date(each.checkInAt);
  //     if (each.checkOutAt) each.checkOutAt = new Date(each.checkOutAt);
  //     else each.checkOutAt = null;
  //   })
  // }
  // convertReser(data: Reservation[]) {
  //   data.forEach(each => {
  //     each.reservedAt = new Date(each.reservedAt);
  //     if (each.reservedOut) each.reservedOut = new Date(each.reservedOut);
  //   })
  // }
  // havedetailId(reser: Reservation) {
  //   this.reServationDetailService.getOneReservationDetails(reser.id).subscribe((details) => {
  //     if (details.length == 0)
  //       this.arrayReServations.push(reser);
  //   }
  //   )
  // }
  
  checkDate(date: Date) {
    if (date.getTime() >= this.date.getTime() && date.getTime() < this.dateEnd.getTime())
      return true;
    return false
  }
}

