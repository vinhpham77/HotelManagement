import { Component, ElementRef, SimpleChanges } from '@angular/core';
import { AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormControl } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { RoomType } from 'src/app/models/RoomType';
import { Room } from 'src/app/models/Room';
import { DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { OnChanges } from '@angular/core';


import { MatDatepicker } from '@angular/material/datepicker';
import { ReservationService } from 'src/app/services/reservation.service';
import { Reservation } from 'src/app/models/reservation';
import { Observable } from 'rxjs';

import { RoomsService } from 'src/app/services/rooms.service';

import { CustomersService } from 'src/app/services/customers.service';

import { ReservationDetail } from 'src/app/models/ReservationDetail';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';

import { RoomTypesService } from 'src/app/services/room-types.service';
import { Customer } from 'src/app/models/Customer';

export interface UserData {
  customername: string;
  reserAt: Date;
  reserOut: Date | null;
  phone: string;
  state: string;
}


@Component({
  selector: 'app-book-room',
  templateUrl: './book-room.component.html',
  styleUrls: ['./book-room.component.css']
})
export class BookRoomComponent {

  selectedDate!: Date;
  listRoomTypes: RoomType[] = [];
  reservations!: Reservation[];
  rooms!: Room[];
  arraysum = new Array();
  arrayfix = new Array();
  lenght!: number;
  fromDate!: string;
  getDate!: number;
  getMonth!: number;
  getYear!: number;
  today = new Date();

  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<Date>;
  @ViewChild('myInputFrom') myInputFrom!: ElementRef;
  @ViewChild('myInputTo') myInputTo!: ElementRef;
  @ViewChild('inputTab') inputTab!: ElementRef;
  @ViewChild('datepicker12') datepicker12!: MatDatepicker<Date>;
  @ViewChild('selectRoomTypes') selectRoomTypes!: ElementRef;
  selectedDateFirstTab!: Date;
  date: number = 1;
  month: number = 1;
  year: number = 2023;
  maxdate!: number;
  maxmonth: number = 12;

  selectedRoom!: string;
  searchQuery: string = '';

  getSearchQuery(searchQuery: string) {
    if (searchQuery != '') {
      return true;
    }
    else
      return false;
  }

  isAddReservationVisible: boolean = false;
  isEditResertationVisible: boolean = false;
  isReceiveRoomVisible: boolean = false;
  isNormalVisible: boolean = true;
  statusRoom: boolean = false;
  showAddReservationVisible() {
    this.isAddReservationVisible = true;
    this.isEditResertationVisible = false;
    this.isReceiveRoomVisible = false;
    this.isNormalVisible = false;
  }
  showEditResertationVisible() {
    this.isAddReservationVisible = false;
    this.isEditResertationVisible = true;
    this.isReceiveRoomVisible = false;
    this.isNormalVisible = false;
  }
  showReceiveRoomVisible() {
    this.isAddReservationVisible = false;
    this.isEditResertationVisible = false;
    this.isReceiveRoomVisible = true;
    this.isNormalVisible = false;
  }


  xemketqua() {
    const datefrom = this.myInputFrom.nativeElement.value;
    const datefrompipe = new Date(datefrom);
    const dateto = this.myInputTo.nativeElement.value;
    const datetopipe = new Date(dateto);
    const diffInMs = datetopipe.getTime() - datefrompipe.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    this.lenght = diffInDays;
    this.arraysum = Array(this.lenght).fill(0);

    this.getDate = datefrompipe.getDate();
    this.getMonth = datefrompipe.getMonth();

  }

  remove(room: Room): void {
    const index = this.rooms.indexOf(room);

    if (index >= 0) {
      this.rooms.splice(index, 1);
    }
  }
  dateString!: string;

  newdate: Date = new Date();
  selectTab!: number;

  chuyenTab() {
    this.selectTab = 2;

  }
  onKey(dates: any) {
    this.indexDate = dates;
  }

  myDate!: string;
  listDate!: any;
  indexDate!: number;
  incrementedValues: number[] = [];

  khoitaongayTabThird() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    this.myDate = `${year}-${month}-${day}`;
  }
  calculateIncrementedValues(): void {
    this.incrementedValues = this.listDate.map((_: any, i: number) => i + 1);
  }
  viewbydate() {
    const year = this.yearTabSecond;
    const month = this.monthTabSecond;
    const day = this.indexDate;
    // this.myDate = `${year}-${month}-${day}`;
    this.dateString = year + "-" + month + "-" + day;
    const formattedDate = this.datePipe.transform(this.dateString, 'yyy-MM-dd');
    this.inputTab.nativeElement.value = formattedDate;
    this.myDate = this.inputTab.nativeElement.value;
  }
  constructor(private _liveAnnouncer: LiveAnnouncer,
    private reservationService: ReservationService,
    private roomService: RoomsService,
    private datePipe: DatePipe,
    private customerService: CustomersService,
    private reservationDetailsService: ReservationDetailService,
    private roomTypesService: RoomTypesService) {
    this.khoitaongayTabThird();
    this.getDate = this.today.getDate();
    this.getMonth = this.today.getMonth() + 1;
    this.getYear = this.today.getFullYear();
    this.maxdate = this.fun(this.getMonth, this.getYear);
    this.listDate = Array(this.maxdate).fill(0);
    this.arrayfix = Array(6).fill(0);
    this.monthTabSecond = this.getMonth;
    this.yearTabSecond = this.getYear;
    this.calculateIncrementedValues();
    // reservationService.get.subscribe((data) => { this.reservations = data; });
    // reservationDetailsService.getReservationDetails().subscribe((data) => {
    //   this.listCheckReseDetail = data;})
    // this.list();
    // roomService.getRoom().subscribe((data) => {
    //   this.rooms = data;
    //   for (var i = 0; i < data.length; i++) {
    //     if (data[i].status + "" == 'true')
    //       this.rooms[i].status = true;
    //     else
    //       this.rooms[i].status = false;
    //   };

    //   this.selectedRoom = data[0].roomType;
    // });
    // this.roomTypesService.getRoomTypes().subscribe((data) => {
    //   this.listRoomTypes = data;
    // })
    // this.customerService.getCustomers().subscribe((data) => this.listcus = data)
  }


  listcus: Customer[] = [];
  listDetail: ReservationDetail[] = []
  customerId: any;
  customerName: string = '';
  customerPhone: any;
  check: boolean = false;
  newReservation!: Reservation;
  dateCheckin!: Date;
  dateCheckout!: Date | null;
  numberrooms!: number;
  listrooms: string[] = [];
  valuenull: string = 'all';

  check_arr(element: any, arr: any) {
    let i, count;
    count = i = 0;
    while (i < arr.length) {
      if (arr[i] === element) {
        count++;
        break
      }
      ++i;
    }
    return (count > 0) ? true : false
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['inputTab'] && !changes['data'].firstChange) {
      // Gọi hàm hoặc logic để tải lại dữ liệu khi có thay đổi
      // this.checkDateReservation(this.dateThird);
    }
    // if (this.selectRoomTypes.nativeElement.value) {
    //   console.log("o");
    //   console.log(this.selectRoomTypes.nativeElement.value);
    // }
  }
  getroomType(roomtype: string) {
    this.selectedRoom = roomtype;
    // console.log(this.selectedRoom)
  }
  onDate(date: any) {
    const value = date.value;
    this.inputTab.nativeElement.value = value;
  }
  onDateTabFirstFrom(date: any) {
    const value = date.value;
    const today = new Date(value);
    this.getDate = today.getDate();
    this.getMonth = today.getMonth() + 1;
    this.getYear = this.today.getFullYear();
    this.dateString = this.getMonth + "/ " + this.getDate + "/" + this.getYear;
    const formattedDate = this.datePipe.transform(this.dateString, 'dd/MM/yyyy');
    this.myInputFrom.nativeElement.value = formattedDate;
  }
  onDateTabFirstTo(date: any) {
    const value = date.value;
    const today = new Date(value);
    const getDate = today.getDate();
    const getMonth = this.today.getMonth() + 1;
    const getYear = this.today.getFullYear();
    this.dateString = getMonth + "/ " + getDate + "/" + getYear;
    const formattedDate = this.datePipe.transform(this.dateString, 'dd/MM/yyyy');
    this.myInputTo.nativeElement.value = formattedDate;
  }

  formartDate(date: Date): any {
    this.today = new Date(date);
    const getDate = this.today.getDate();
    const getMonth = this.today.getMonth() + 1;
    const getYear = this.today.getFullYear();
    this.dateString = getYear + "-" + getMonth + "-" + getDate;
    const formattedDate = this.datePipe.transform(this.dateString, 'yyyy-MM-dd');
    return formattedDate;
  }
  // checkReservation() {
  //   this.reservationService.getReservation().subscribe((data) => {
  //     for (var i = 0; i < data.length; i++) {
  //       const formattedDate = this.formartDate(data[i].reservedAt);
  //       const fformattedDate=new Date(data[i].reservedAt);
  //       const finputDate=new Date(this.inputTab.nativeElement.value)
  //       if (formattedDate.getTime() == this.inputTab.nativeElement.value.getTime()) {
  //         this.numberrooms = data[i].roomIds.length;
  //         for (var r = 0; r < data[i].roomIds.length; r++) {
  //           if (!this.check_arr(data[i].roomIds[r], this.listrooms))
  //             this.listrooms.push(data[i].roomIds[r]);

  //         }
  //         this.newReservation = data[i];
  //         this.customerService.getCustomers().subscribe((customers) => {
  //           for (var j = 0; j < customers.length; j++) {
  //             if (customers[i].id == data[i].customerId) {
  //               this.customerName = customers[i].lastName;
  //               this.customerPhone = customers[i].phoneNumber;
  //               break;
  //             }
  //           }
  //         });
  //         this.reservationDetailsService.getReservationDetails().subscribe((reserDetails) => {
  //           for (var k = 0; reserDetails.length; k++) {
  //             if (reserDetails[k].customerId == data[i].customerId) {
  //               this.dateCheckin = reserDetails[k].checkInAt;
  //               this.dateCheckout = reserDetails[k].checkOutAt;
  //               break;
  //             }
  //           }
  //         })

  //         this.check = true;
  //         break;
  //       }
  //       else
  //         this.check = false;

  //     }
  //   })
  // }
  listCheckReseDetail: ReservationDetail[] = [];
  listCheckRese: Reservation[] = [];
  status: string = '';
  roomlist: string[] = [];
  idTabThird!: string
  cus!: Customer

  findCus(idcus: string) {
    for (var i = 0; i < this.listcus.length; i++) {
      if (this.listcus[i].id == idcus) {
        this.cus = this.listcus[i];
      }
      else this.cus = <Customer>{
        lastName: ''
      }
    }
  }
  // findcus(id: string) {
  //   this.customerService.getCustomers().subscribe((data) => {
  //     for (var i = 0; i < data.length; i++) {
  //       if (data[i].id == id)
  //   }

  //   })
  // }



  // list() {
  //   let p = <Reservation>{};
  //   let q = <ReservationDetail>{}
  //   let user = <UserData>{};
  //   let c=<custommer>{}
  //   this.reservationDetailsService.getReservationDetails().subscribe((data) => {
  //     for (var i = 0; i < data.length; i++) {
  //       q = data[i];
  //       // console.log(q);
        
  //       if (this.check_arr(q, this.listUserData)==false)  {
  //         // console.log(q.customerId,"l1")
  //         this.customerService.getCustomers().subscribe((listcus) => {
  //           for (var j = 0; j < listcus.length; j++) {
  //             // console.log(q.customerId,"l")
  //                 c=this.listcus[j];
  //             // console.log(q.customerId,c.id)
  //             if (c.id == q.customerId) {
  //               this.customerName = c.lastName;
  //               this.customerPhone = c.phoneNumber;
  //               if (q.checkOutAt == null)
  //                 this.status = 'Chưa trả phòng';
  //               else
  //                 this.status = 'Đã trả phòng';
  //               this.dateCheckin = q.checkInAt;
  //               this.dateCheckout = q.checkOutAt;
  //               user = <UserData>{
  //                 customername: c.lastName,
  //                 reserAt: q.checkInAt,
  //                 reserOut: q.checkOutAt ? q.checkOutAt : null,
  //                 phone: c.phoneNumber,
  //                 state: this.status
  //               }
               
  //               this.listUserData.push(user); break;
  //             }
  //           }
  //         })
        
  //       }
  //     }
  //   })
  //   //
  //   this.reservationService.getReservation().subscribe((reservations) => {
  //     for (var i = 0; i < reservations.length; i++) {
  //       p = reservations[i];
  //       this.reservationDetailsService.getReservationDetails().subscribe((reserDetails) => {
  //         for (var k = 0; k < reserDetails.length; k++) {
  //           if (reserDetails[k].reservevationId != p.id) {
  //             if (this.check_arr(p, this.listUserData) == false) {
  //               this.listUserData.push(p);
  //               this.idTabThird = p.id
  //               this.dateCheckin = p.reservedAt;
  //               this.dateCheckout = p.reservedOut;
  //               this.customerService.getCustomers().subscribe((data) => {
  //                 for (var j = 0; j < data.length; j++) {
  //                   if (data[j].id == p.id) {
  //                     this.customerName = data[j].lastName;
  //                     this.customerPhone = data[j].phoneNumber;
  //                     break;
  //                   }
  //                 }
  //               })

  //               // this.customerName = this.cus.lastName;
  //               // this.customerPhone = this.cus.phoneNumber
  //               this.status = 'Chưa nhận phòng';
  //               user = <UserData>{
  //                 customername: this.customerName,
  //                 reserAt: p.reservedAt,
  //                 reserOut: p.reservedOut,
  //                 phone: this.customerPhone,
  //                 state: this.status
  //               }
  //               this.listUserData.push(user); break;
  //             }
  //             break;
  //           }
  //         }

  //       })
  //     }
  //   })
  // }

  // checkStatusReservation(date: Date) {

  //   this.listCheckReseDetail = [];
  //   this.reservationDetailsService.getReservationDetails().subscribe((data) => {
  //     this.convert(data);
  //     for (var i = 0; i < data.length; i++) {

  //       if (this.checkDateReservationDetail(date, data[i]) && !this.check_arr(data[i], this.listCheckReseDetail)) {
  //         this.listCheckReseDetail.push(data[i]);
  //         console.log(data[i])
  //         for (var j = 0; j < this.listcus.length; j++) {
  //           if (this.listcus[j].id == data[i].customerId) {
  //             console.log(this.cus)
  //             this.cus = this.listcus[j];
  //             this.customerName = this.cus.lastName;
  //             this.customerPhone = this.cus.phoneNumber;
  //             this.numberrooms = 1;
  //             if (data[i].checkOutAt == null)
  //               this.status = 'Chưa trả phòng';
  //             else
  //               this.status = 'Đã trả phòng';
  //             this.dateCheckin = data[i].checkInAt;
  //             this.dateCheckout = data[i].checkOutAt;
  //           }
  //         }
  //       }
  //     }
  //   })


  //   // this.listCheckRese = []

  //   //   this.convertReser(this.reservations);
  //   //   for (var i = 0; i < this.reservations.length; i++) {
  //   //     if (this.checkDateReservation(date, this.reservations[i]) && this.NohavedetailId(this.reservations[i])) {
  //   //       if (this.check_arr(this.reservations[i], this.listCheckRese) == false) {

  //   //         this.listCheckRese.push(this.reservations[i]);
  //   //         console.log("list reser: ",this.listCheckRese)
  //   //         this.idTabThird = this.reservations[i].id
  //   //         this.roomlist = this.reservations[i].roomIds;
  //   //         this.dateCheckin =this.reservations[i].reservedAt;
  //   //         this.dateCheckout = this.reservations[i].reservedOut;
  //   //         this.findCus(this.reservations[i].customerId);
  //   //         this.customerName = this.cus.lastName;
  //   //         this.customerPhone = this.cus.phoneNumber
  //   //         this.numberrooms = this.reservations[i].roomIds.length;
  //   //         this.status = 'Chưa nhận phòng';
  //   //       }
  //   //    }
  //   //  }



  // }
  idDetail: boolean = true


  NohavedetailId(reser: Reservation) {
    let k = this.listCheckReseDetail.find(each => each.reservevationId == reser.id)?.id;
    if (k) return false;
    return true;

  }

  // convertReser(data: Reservation[]) {
  //   data.forEach(each => {
  //     each.reservedAt = new Date(each.reservedAt);
  //     if (each.reservedOut) each.reservedOut = new Date(each.reservedOut);
  //   })
  // }
  // convert(data: ReservationDetail[]) {
  //   data.forEach(each => {
  //     each.checkInAt = new Date(each.checkInAt);
  //     if (each.checkOutAt) each.checkOutAt = new Date(each.checkOutAt);
  //     else each.checkOutAt = null;
  //   })
  // }
  // checkDateReservationDetail(date: Date, data: ReservationDetail) {
  //   if (date.getTime() >= data.checkInAt.getTime())
  //     if (data.checkOutAt == null && date.getTime() <= new Date().getTime() || data.checkOutAt?.getTime() && date.getTime() <= data.checkOutAt.getTime())
  //       return true;
  //   return false;
  // }
  // checkDateReservation(date: Date, data: Reservation) {
  //   if ((date.getTime() >= data.reservedAt.getTime()) && (date.getTime() <= data.reservedOut.getTime()))
  //     return true;
  //   return false;
  // }
  isCheck(nam: any) {
    return ((nam % 4 == 0 && nam % 100 != 0) || nam % 400 == 0);
  }

  fun(thang: any, nam: any): any {
    switch (thang) {
      case 1: case 3: case 5: case 7: case 8: case 10: case 12: return 31;
      case 4: case 6: case 9: case 11: return 30;
      case 2:
        if (this.isCheck(nam))
          return 29;
        else
          return 28;
    }
  }
  getValueDatepiker() {
    this.today = new Date(this.inputTab.nativeElement.value);
    this.getDate = this.today.getDate();
    this.getMonth = this.today.getMonth() + 1;
    this.getYear = this.today.getFullYear();
    this.maxdate = this.fun(this.getMonth, this.getYear);

  }
  setValueDatepiker() {
    this.dateString = this.getYear + "-" + this.getMonth + "-" + this.getDate;
    const formattedDate = this.datePipe.transform(this.dateString, 'yyyy-MM-dd');
    this.inputTab.nativeElement.value = formattedDate;
    this.dateThird = new Date(this.inputTab.nativeElement.value);
  }
  dateThird!: Date;

  arrow_back() {
    this.getValueDatepiker();
    if (this.getMonth == 1 && this.getDate == 1) {
      this.getYear--;
      this.getMonth = 12;
      this.getDate = this.maxdate;
    }
    else {
      if (this.getDate == 1 && this.getMonth > 1) {
        this.getMonth = this.getMonth - 1;
        this.getDate = this.maxdate;
      }
      else {
        this.getDate--;
      }
    }
    this.setValueDatepiker();
  }
  monthTabSecond!: number;
  yearTabSecond!: number;
  arrow_backTabSecond() {
    if (this.monthTabSecond == 1) {
      this.yearTabSecond--;
      this.monthTabSecond = 12;
    }
    else {
      this.monthTabSecond--;
    }
    this.maxdate = this.fun(this.monthTabSecond, this.yearTabSecond);
    this.listDate = Array(this.maxdate).fill(0);

  }
  arrow_forwardTabSecond() {
    if (this.monthTabSecond == 12) {
      this.yearTabSecond++;
      this.monthTabSecond = 1;
    }
    else {
      this.monthTabSecond++;
    }
    this.maxdate = this.fun(this.monthTabSecond, this.yearTabSecond);
    this.listDate = Array(this.maxdate).fill(0);
  }
  arrow_forward() {
    this.getValueDatepiker();
    if (this.getMonth == 12 && this.getDate == this.maxdate) {
      this.getYear++;
      this.getMonth = 1;
      this.getDate = 1;
    }
    else {
      if (this.getDate == this.maxdate) {
        this.getDate = 1;
        this.getMonth++;
      }
      else
        this.getDate++;
    }
    this.setValueDatepiker();
  }
  displayedColumns: string[] = ['id', 'customer', 'reserAt', 'reserOut', 'phone', 'status', 'operate'];
  listUserData: any = [];
  dataSource = new MatTableDataSource<UserData>(this.listUserData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // constructor() {
  //   // Create 100 users
  //   const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

  //   // Assign the data to the data source for the table to render
  //   
  // }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    this.dataSource.sort = this.sort;

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}


  // return {
  //   id: id.toString(),
  //   // name:
  //   // progress: Math.round(Math.random() * 100).toString(),
  //   // fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
  // };

/** Builds and returns a new User. */





