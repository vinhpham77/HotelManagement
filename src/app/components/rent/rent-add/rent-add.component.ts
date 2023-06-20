import { OrderDetail } from 'src/app/models/order-detail';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from 'src/app/models/Customer';
import { ReservationDetail } from 'src/app/models/ReservationDetail';
import { Room } from 'src/app/models/Room';
import { Order } from 'src/app/models/order';
import { CustomersService } from 'src/app/services/customers.service';
import { MenuService } from 'src/app/services/menu.service';
import { OrderService } from 'src/app/services/order.service';
import { ReservationDetailService } from 'src/app/services/reservation-detail.service';
import { RoomsService } from 'src/app/services/rooms.service';

@Component({
  selector: 'app-rent-add',
  templateUrl: './rent-add.component.html',
  styleUrls: ['./rent-add.component.scss']
})
export class RentAddComponent implements OnChanges {
  @Input() roomId!: string;
  public  room: Room = <Room>{};
  public customer: Customer = <Customer>{};
  public bookRoomForm!: FormGroup;
  public formCustomer = false;
  public isCreateCustomer= false;
  public isIdNo = false;
  @Output() created = new EventEmitter();

  constructor(private roomService: RoomsService,
    private fb: FormBuilder,
    private customerService: CustomersService,
    private orderService: OrderService,
    private reservationdetailService: ReservationDetailService,
    private _snackBar: MatSnackBar) {
      this.bookRoomForm = this.fb.group({
        idNo: [null],
        fullName: [null, Validators.required],
        totalAdults: [null, [Validators.required, Validators.min(0)]],
        totalChildren: [null, [Validators.required, Validators.min(0)]],
        deposit: [0, [Validators.required, Validators.min(0)]],
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        fullName2: [null, Validators.required],
        phoneNumber: [null,[Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        idNo2: [null, [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
        nationality: [null, Validators.required],
        birthday: [null, Validators.required],
        sex: [null, Validators.required]
      })
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.roomService.getRoomById(this.roomId).subscribe({
      next: next => {
        this.room = next;
        this.room.lastCleanedAt = new Date(this.room.lastCleanedAt);
      }
    })
  }

  save()
  {
    if(this.FullName?.valid && this.TotalAdults?.valid && this.TotalChildren?.valid)
    {
      var reservationDetail: ReservationDetail = <ReservationDetail>{
        reservationId: null,
        roomId: this.roomId,
        checkedInAt: new Date(),
        checkedOutAt: null,
        deposit: this.Deposit?.value*1000,
        totalAdults: this.TotalAdults?.value,
        totalChildren: this.TotalChildren?.value,
        roomPricePerDay: this.room.pricePerDay
      }
      this.room.isEmpty = false;
      if(this.isCreateCustomer)
      {
        this.customerService.create(this.customer).subscribe({
          next: next => {
            this.customerService.getCustomersByNoId(this.customer.idNo).subscribe({
              next: next => {
                reservationDetail.customerId = next.items[0].id;
                this.reservationdetailService.create(reservationDetail).subscribe({
                  next: next=> {
                    this.reservationdetailService.getReservationDetail(this.room.id).subscribe({
                      next: next => {
                        var order: Order = <Order><unknown>{
                          reservationDetailId: next.items[0].id,
                          details: []
                        };
                        this.orderService.create(order).subscribe({
                          next: next => {
                            this.roomService.update(this.room).subscribe({
                              next: next => {
                                this._snackBar.open("Đặt phòng thành cồng", "",{
                                  duration: 1000,
                                  horizontalPosition: 'right',
                                  verticalPosition: 'top',
                                });
                                this.created.emit();
                              }
                            })
                          }
                        })
                        
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
      else{
        reservationDetail.customerId = this.customer.id;
        this.reservationdetailService.create(reservationDetail).subscribe({
          next: next=> {
            this.reservationdetailService.getReservationDetail(this.room.id).subscribe({
              next: next => {
                var order: Order = <Order><unknown>{
                  reservationDetailId: next.items[0].id,
                  details: []
                };
                this.orderService.create(order).subscribe({
                  next: next => {
                    this.roomService.update(this.room).subscribe({
                      next: next => {
                        this._snackBar.open("Đặt phòng thành cồng", "",{
                          duration: 1000,
                          horizontalPosition: 'right',
                          verticalPosition: 'top',
                        });
                        this.created.emit();
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
  }

  findIdNo()
  {

    var idNo = this.IdNo?.value;
    if(idNo)
    {
      this.customerService.getCustomersByNoId(idNo).subscribe({
        next: next =>{
          this.customer = next.items[0];
          if(this.customer)
          {
            this.FullName?.setValue(this.customer.fullName);
            this.isCreateCustomer = false;
          }
        }
      })
    }
  }

  showFormCustomer() {
    this.formCustomer = true;
  }

  hideFormCustomer(){
    this.formCustomer = false;
  }

  createCustomer() {
    if(this.FirstName?.valid && this.LastName?.valid 
      && this.FullName2?.valid && this.PhoneNumber?.valid
      && this.IdNo2?.valid && this.Nationality?.valid)
      {
        this.customerService.getCustomersByNoId(this.IdNo2?.value).subscribe({
          next: next => {
            if(next.items.length > 0)
            {
              this.isIdNo = false;
            }
            else {
              this.formCustomer = false;
              this.isIdNo = true;
              this.isCreateCustomer = true;
              this.FullName?.setValue(this.FullName2?.value);
              this.customer.firstName = this.FirstName?.value;
              this.customer.lastName = this.LastName?.value;
              this.customer.fullName = this.FullName2?.value;
              this.customer.phoneNumber = this.PhoneNumber?.value;
              this.customer.idNo = this.IdNo2?.value;
              this.customer.birthdate = this.Birthday?.value;
              this.customer.nationality = this.Nationality?.value;
              this.customer.sex = this.Sex?.value;
            }
          }
        })
      }
  }

  get IdNo() {
    return this.bookRoomForm.get('idNo');
  }

  get FullName() {
    return this.bookRoomForm.get('fullName');
  }

  get TotalAdults() {
    return this.bookRoomForm.get('totalAdults');
  }
  get TotalChildren() {
    return this.bookRoomForm.get('totalChildren');
  }

  get Deposit() {
    return this.bookRoomForm.get('deposit');
  }

  get FirstName() {
    return this.bookRoomForm.get('firstName');
  }

  get LastName() {
    return this.bookRoomForm.get('lastName');
  }

  get FullName2() {
    return this.bookRoomForm.get('fullName2');
  }

  get PhoneNumber() {
    return this.bookRoomForm.get('phoneNumber');
  }

  get IdNo2() {
    return this.bookRoomForm.get('idNo2');
  }

  get Nationality() {
    return this.bookRoomForm.get('nationality');
  }

  get Birthday() {
    return this.bookRoomForm.get('birthday');
  }

  get Sex() {
    return this.bookRoomForm.get('sex');
  }
}
