import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { CustomersService } from '../../../services/customers.service';
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
import { Receipt } from '../../../models/receipt';
import { ReceiptService } from '../../../services/receipt.service';
import { ReceiptDtosService } from '../../../services/receipt-dtos.service';

@Component({
  selector: 'app-update-receipt',
  templateUrl: './update-receipt.component.html',
  styleUrls: ['./update-receipt.component.scss']
})
export class UpdateReceiptComponent {
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
  previousQuantity = 1;
  dataSource: OrderDetail[] = [];
  displayedColumns: string[] = ['item', 'quantity', 'price', 'operation'];

  @ViewChild(MatTable) table!: MatTable<OrderDetail>;

  receiveDtoForm = this.fb.group({
    checkedInAt: this.fb.control<Date | null>(null, [this.dateTimeCompare('checkedInTime',
      'checkedOutAt', 'checkedOutTime', false, false)]),
    checkedInTime: ['', [Validators.required, this.timeValidator, this.dateTimeCompare('checkedInAt',
      'checkedOutAt', 'checkedOutTime', false, true)]],
    checkedOutAt: this.fb.control<Date | null>(null, [this.dateTimeCompare('checkedOutTime',
      'checkedInAt', 'checkedInTime', true, false)]),
    checkedOutTime: ['', [Validators.required, this.timeValidator, this.dateTimeCompare('checkedOutAt', 'checkedInAt', 'checkedInTime', true, true)]],
    roomPrice: [0],
    surcharge: [0],
    deposit: [0],
    totalMenuPrice: [0],
    totalPrice: [0],
    payment: [0]
  });

  get CheckedInAt() {
    return this.receiveDtoForm.get('checkedInAt');
  }

  get CheckedOutAt() {
    return this.receiveDtoForm.get('checkedOutAt');
  }

  get TotalMenuPrice() {
    return this.receiveDtoForm.get('totalMenuPrice');
  }

  get TotalPrice() {
    return this.receiveDtoForm.get('totalPrice');
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
              private menuService: MenuService,
              private receiptService: ReceiptService,
              private receiptDtosService: ReceiptDtosService) {
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

      const date = this.getDateTimeFromControl(dateControl, timeControl!);
      if (!date) {
        return null;
      }

      const compareDate = this.getDateTimeFromControl(compareDateControl, compareTimeControl);
      if (!compareDate) {
        return null;
      }

      if (isGreater) {
        return date > compareDate ? null : { dateTimeCompare: true };
      } else
        return date < compareDate ? null : { dateTimeCompare: true };
    };
  };

  getDateTimeFromControl(dateControl: AbstractControl, timeControl: AbstractControl) {
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
    let roomPrice = this.resDetailService.getTotalRoomPrice(this.reservationDetail, checkedIn, checkedOut);
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
    return this.commonService.convertToNumber(value);
  }

  openBottomSheet(): void {
    this._bottomSheet.open(MenuBottomComponent, { data: this.order })
      .afterDismissed().subscribe(result => {
      if (!result) return;

      this.dataSource.push(<OrderDetail>{
        itemId: result.id,
        quantity: 1,
        price: result.exportPrice,
        orderedAt: new Date()
      });

      this.table.renderRows();
      this.setTotalMenuPrice(this.setTotalPrice, this.setPayment);
    });
  }

  getTime(date: Date | null): string {
    date = new Date(date!);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }


  onCancel() {
    this.isHidden = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refreshOnSuccess(msg: string) {
    this.isHidden = true;
    this.receiptDtosService.load();
    this.commonService.openSnackBar(msg);
  }

  onDateChange() {
    if (!this.receiveDtoForm.valid) return;

    let checkedIn = this.getDateTimeFromControl(this.CheckedInAt!, this.CheckedInTime!);
    let checkedOut = this.getDateTimeFromControl(this.CheckedOutAt!, this.CheckedOutTime!);

    this.usageDays = this.resDetailService.daysIn(checkedIn!, checkedOut!);
    this.setRoomPriceAndSurcharge(checkedIn!, checkedOut!);
    this.setTotalMenuPrice(this.setTotalPrice, this.setPayment);
  }

  onTimeChange() {
    if (!this.receiveDtoForm.valid) return;

    let checkedIn = this.getDateTimeFromControl(this.CheckedInAt!, this.CheckedInTime!);
    let checkedOut = this.getDateTimeFromControl(this.CheckedOutAt!, this.CheckedOutTime!);

    this.setEarlyTime(checkedIn!);
    this.setLateTime(checkedOut!);
    this.usageDays = this.resDetailService.daysIn(checkedIn!, checkedOut!);
    this.setRoomPriceAndSurcharge(checkedIn!, checkedOut!);
    this.setTotalMenuPrice(this.setTotalPrice, this.setPayment);
  }

  deleteOrderDetail(item: OrderDetail) {
    let index = this.dataSource.findIndex(each => {
        return each.itemId === item.itemId && each.orderedAt === item.orderedAt;
      }
    );

    this.dataSource.splice(index, 1);
    this.table.renderRows();
    this.setTotalMenuPrice(this.setTotalPrice, this.setPayment);
  }

  startInputting(event: Event) {
    this.previousQuantity = parseInt((event.target as HTMLInputElement).value);
  }

  updateQuantity(event: Event, item: OrderDetail) {
    const inputElement = event.target as HTMLInputElement;
    let currentQuantity = parseInt(inputElement.value);
    if (currentQuantity && currentQuantity > 0) {
      item.quantity = currentQuantity;
      this.setTotalMenuPrice(this.setTotalPrice, this.setPayment);
    }
  }

  rollBackQuantity(event: Event, item: OrderDetail) {
    const inputElement = event.target as HTMLInputElement;
    item.quantity = this.previousQuantity;
    inputElement.value = item.quantity + '';
  }

  getItemName(itemId: string) {
    let item = this.menu.find(item => item.id === itemId);
    return item ? item.name : '';
  }

  onSave() {
    if (!this.receiveDtoForm.valid) return;

    let checkedIn = this.getDateTimeFromControl(this.CheckedInAt!, this.CheckedInTime!);
    let checkedOut = this.getDateTimeFromControl(this.CheckedOutAt!, this.CheckedOutTime!);
    let totalMenuPrice = this.commonService.convertToNumber(this.TotalMenuPrice?.value);
    let totalPrice = this.commonService.convertToNumber(this.TotalPrice?.value);
    let deposit = this.commonService.convertToNumber(this.Deposit?.value);

    this.reservationDetail.checkedInAt = checkedIn!;
    this.reservationDetail.checkedOutAt = checkedOut!;
    this.reservationDetail.deposit = deposit;
    this.order.details = this.dataSource;

    const receipt = <Receipt>{
      id: this.receiptDto.id,
      personnelId: this.receiptDto.personnelId,
      reservationDetailId: this.receiptDto.reservationDetailId,
      orderPrice: totalMenuPrice,
      totalPrice,
      createdAt: this.receiptDto.createdAt
    };

    this.update(this.order, this.reservationDetail, receipt);
  }

  update(order: Order, reservationDetail: ReservationDetail, receipt: Receipt) {
    this.orderService.update(order).pipe(
      switchMap(() => this.resDetailService.update(reservationDetail)),
      switchMap(() => this.receiptService.update(receipt))
    ).subscribe({
      next: () => this.refreshOnSuccess('Cập nhật thành công'),
      error: () => {
        this.commonService.openSnackBar('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    });
  }

  updatePrices() {
    this.setTotalPrice();
    this.setPayment();
  }
}
