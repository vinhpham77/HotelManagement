import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { CustomersService } from '../../../services/customers.service';
import { Customer } from '../../../models/Customer';
import { MenuBottomComponent } from '../../rent/menu-bottom/menu-bottom.component';
import { OrderDetail } from '../../../models/order-detail';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Order } from '../../../models/order';
import { MatTable } from '@angular/material/table';
import { ReservationDetail } from '../../../models/ReservationDetail';
import { Room } from '../../../models/Room';
import { OrderService } from '../../../services/order.service';
import { ReservationDetailService } from '../../../services/reservation-detail.service';
import { ReceiptDto } from '../../../models/ReceiptDto';
import { MenuService } from '../../../services/menu.service';
import { MenuItem } from '../../../models/MenuItem';

@Component({
  selector: 'app-update-receipt',
  templateUrl: './update-receipt.component.html',
  styleUrls: ['./update-receipt.component.scss']
})
export class UpdateReceiptComponent implements OnInit {
  now = new Date();
  data: any;
  subscription: Subscription;
  isHidden = true;
  order!: Order;
  receiptDto!: ReceiptDto;
  reservationDetail!: ReservationDetail;
  room!: Room;
  menu: MenuItem[] = [];
  usageDays = 0;
  earlyHours = 0;
  earlyMinutes = 0;
  lateHours = 0;
  lateMinutes = 0;
  dataSource: OrderDetail[] = [];

  @ViewChild(MatTable) table!: MatTable<OrderDetail>;

  receiveDtoForm = this.fb.group({
    checkedInAt: this.fb.control<Date | null>(null, [this.dateTimeCompare('checkedInTime',
      'checkedOutAt', 'checkedOutTime', false, false)]),
    checkedInTime: ['', [Validators.required, this.timeValidator, this.dateTimeCompare('checkedInAt',
      'checkedOutAt', 'checkedOutTime', false, true)]],
    checkedOutAt: this.fb.control<Date | null>(null, [this.dateTimeCompare('checkedOutTime',
      'checkedInAt', 'checkedInTime', false, false)]),
    checkedOutTime: ['', [Validators.required, this.timeValidator, this.dateTimeCompare('checkedOutAt', 'checkedInAt', 'checkedInTime', true, true)]],
    roomPrice: [0, []],
    surcharge: [0, []],
    deposit: [0, []],
    totalMenuPrice: [0, []],
    totalPrice: [0, []],
    payment: [0, []]
  });

  get CheckedInAt() {
    return this.receiveDtoForm.get('checkedInAt');
  }

  get CheckedOutAt() {
    return this.receiveDtoForm.get('checkedOutAt');
  }

  get RoomPrice() {
    return this.receiveDtoForm.get('roomPrice');
  }

  get Surcharge() {
    return this.receiveDtoForm.get('surcharge');
  }

  get TotalMenuPrice() {
    return this.receiveDtoForm.get('totalMenuPrice');
  }

  get TotalPrice() {
    return this.receiveDtoForm.get('totalPrice');
  }

  get Payment() {
    return this.receiveDtoForm.get('payment');
  }

  get Deposit() {
    return this.receiveDtoForm.get('deposit');
  }

  get CheckedInTime() {
    return this.receiveDtoForm.get('checkedInTime');
  }

  get CheckedOutTime() {
    return this.receiveDtoForm.get('checkedOutTime');
  }

  constructor(private fb: FormBuilder,
              private commonService: CommonService,
              private customersService: CustomersService,
              private _bottomSheet: MatBottomSheet,
              private orderService: OrderService,
              private resDetailService: ReservationDetailService,
              private menuService: MenuService) {
    this.subscription = this.commonService.formData$.subscribe(data => {
      this.data = data;
      this.receiveDtoForm.reset();

      if (this.data.action === 'update') {
        this.receiptDto = this.data?.object;
        this.reservationDetail = this.receiptDto.reservationDetail;
        this.reservationDetail.checkedOutAt = this.getDate(this.reservationDetail.checkedOutAt);
        this.reservationDetail.checkedInAt = new Date(this.reservationDetail.checkedInAt);
        this.room = this.receiptDto.room;
        this.receiveDtoForm.patchValue({
          checkedInAt: this.reservationDetail.checkedInAt,
          checkedInTime: this.getTime(this.reservationDetail.checkedInAt),
          checkedOutAt: this.reservationDetail.checkedOutAt,
          checkedOutTime: this.getTime(this.reservationDetail.checkedOutAt)
        });

        this.orderService.getOrderByReservationDetail(this.reservationDetail).subscribe(
          {
            next: order => {
              this.order = order;
              this.dataSource = order.details;
            },
            complete: () => {
              this.configTimeAndPrices(this.reservationDetail.checkedInAt, this.reservationDetail.checkedOutAt!);
            }
          });
        this.menuService.getMenuAll().subscribe({
          next: data => {
            this.menu = data.items;
          }
        });
      }

      this.isHidden = false;
    });
  }

  ngOnInit(): void {
  }

  get timeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === '') return null;
      const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
      const isValid = timePattern.test(value);
      return isValid ? null : { invalidTime: true };
    };
  }

  dateTimeCompare(
    dateOrTimeControlName: string,
    compareDateControlName: string,
    compareTimeControlName: string,
    isGreater: boolean,
    isTime: boolean
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let timeControl;
      let dateControl;

      if (isTime) {
        timeControl = control;
        dateControl = control.parent?.get(dateOrTimeControlName);
      } else {
        timeControl = control.parent?.get(dateOrTimeControlName);
        dateControl = control;
      }
      const compareDateControl = control.parent?.get(compareDateControlName);
      const compareTimeControl = control.parent?.get(compareTimeControlName);

      if (!dateControl || !compareDateControl || !compareTimeControl) {
        return null;
      }

      const date = this.getDateTimeControl(dateControl, timeControl!);
      if (!date) {
        return null;
      }

      const compareDate = this.getDateTimeControl(compareDateControl, compareTimeControl);
      if (!compareDate) {
        return null;
      }

      console.log(date, compareDate);

      if (isGreater) {
        return date > compareDate ? null : { dateTimeCompare: true };
      } else
        return date < compareDate ? null : { dateTimeCompare: true };
    };
  };

  getDateTimeControl(dateControl: AbstractControl, timeControl: AbstractControl) {
    const dateValue = dateControl.value;
    const time = timeControl.value;

    if (!dateValue || !time) {
      return null;
    }

    const date = new Date(dateValue);

    if (!/^\d{2}:\d{2}$/.test(time)) {
      return null;
    }

    const [hour, minute] = time.split(':').map(Number);
    date.setHours(hour, minute);

    return date;
  }

  setTotalMenuPrice(setTotalPrice: Function, setPayment: Function) {
    let totalMenuPrice = this.dataSource.reduce((sum, orderDetail) => {
      return sum + orderDetail.price * orderDetail.quantity;
    }, 0);

    this.setCurrency('totalMenuPrice', totalMenuPrice);
    setTotalPrice.bind(this)();
    setPayment.bind(this)();
  }

  setTotalPrice() {
    let roomPrice = this.getCurrency('roomPrice');
    let surcharge = this.getCurrency('surcharge');
    let totalMenuPrice = this.getCurrency('totalMenuPrice');

    let totalPrice = roomPrice + surcharge + totalMenuPrice;
    this.setCurrency('totalPrice', totalPrice);
  }

  setPayment() {
    let totalPrice = this.getCurrency('totalPrice');
    let deposit = this.getCurrency('deposit');
    let payment = totalPrice - deposit;
    this.setCurrency('payment', payment);
  }

  configTimeAndPrices(checkedIn: Date, checkedOut: Date) {
    this.setCurrency('deposit', this.reservationDetail.deposit);
    this.setRoomPriceAndSurcharge(checkedIn, checkedOut);
    this.setTotalMenuPrice(this.setTotalPrice, this.setPayment);
    this.usageDays = this.resDetailService.daysIn(checkedIn, checkedOut);
    this.setEarlyTime(checkedIn);
    this.setLateTime(checkedOut);
  }

  setEarlyTime(checkedIn: Date) {
    this.earlyHours = 12 - checkedIn.getHours();
    this.earlyMinutes = 60 - checkedIn.getMinutes();
    if (this.earlyMinutes < 60)
      this.earlyHours--;
    else
      this.earlyMinutes = 0;
  }

  setLateTime(checkedOut: Date) {
    this.lateHours = checkedOut.getHours() - 12;
    this.lateMinutes = checkedOut.getMinutes();
  }

  setRoomPriceAndSurcharge(checkedIn: Date, checkedOut: Date) {
    let roomPrice = this.resDetailService.getRoomPriceDay(this.reservationDetail, checkedIn, checkedOut);
    let roomSurcharge = this.resDetailService.getRoomSurcharge(this.reservationDetail, this.room, checkedIn, checkedOut);

    this.setCurrency('roomPrice', roomPrice);
    this.setCurrency('surcharge', roomSurcharge);
  }

  getDate(date: Date | null) {
    return date ? new Date(date) : new Date();
  }

  remove(item: OrderDetail) {
    if (item.quantity > 1) {
      item.quantity--;
      this.setTotalMenuPrice(this.setTotalPrice, this.setPayment);
    }
  }

  add(item: OrderDetail) {
    item.quantity++;
    this.setTotalMenuPrice(this.setTotalPrice, this.setPayment);
  }

  setCurrency(control: string, value: number) {
    let formattedValue = this.commonService.convertToCurrency(value);
    this.receiveDtoForm.get(control)?.setValue(formattedValue);
  }

  getCurrency(control: string) {
    let value = this.receiveDtoForm.get(control)?.value;
    console.log(value, control);
    return this.commonService.convertToNumber(value);
  }

  openBottomSheet(): void {
    this._bottomSheet.open(MenuBottomComponent, { data: this.order })
      .afterDismissed().subscribe(result => {
      this.dataSource.push(<OrderDetail>{
        itemId: result.id,
        quantity: 1,
        price: result.price,
        orderedAt: new Date()
      });
      console.log(this);
      this.table.renderRows();
      this.setTotalMenuPrice(this.setTotalPrice, this.setPayment);
    });
  }

  getTime(date: Date | null): string {
    date = new Date(date!);
    return date.getHours() + ':' + date.getMinutes();
  }

  onSave() {
    if (this.receiveDtoForm.valid) {
      // let birthdate = new Date(this.Birthdate?.value as Date).toISOString();

      const customer = <Customer>{};

      if (this.data.action === 'update') {
        customer.id = this.data.object.id;
        this.customersService.update(customer).subscribe(
          {
            next: () => {
              this.refreshOnSuccess('Cập nhật thành công');
            },
            error: () => {
              this.commonService.openSnackBar('Có lỗi xảy ra. Vui lòng thử lại sau');
            }
          }
        );
      }
    } else {
      this.receiveDtoForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.isHidden = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refreshOnSuccess(msg: string) {
    this.isHidden = true;
    this.customersService.load();
    this.commonService.openSnackBar(msg);
  }
}


