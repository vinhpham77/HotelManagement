import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Customer } from 'src/app/models/Customer';
import { ReservationDetail } from 'src/app/models/ReservationDetail';
import { Room } from 'src/app/models/Room';
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
        deposit: [null, [Validators.required, Validators.min(0)]],
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
      }
    })
  }

  save()
  {
    console.log(this.customer)
    if(this.FullName?.valid && this.TotalAdults?.valid && this.TotalChildren?.valid)
    {
      var reservationDetail: ReservationDetail = <ReservationDetail>{
        reservevationId: null,
        
      }
      if(this.isCreateCustomer)
      {

      }
      else{

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
        this.isCreateCustomer = true;
        this.FullName?.setValue(this.FullName2?.value);
        this.customer.firstName = this.FirstName?.value;
        this.customer.lastName = this.LastName?.value;
        this.customer.fullName = this.FullName2?.value;
        this.customer.phoneNumber = this.PhoneNumber?.value;
        this.customer.idNo = this.IdNo2?.value;
        this.customer.birthdate = this.Birthday?.value;
        this.customer.nationality = this.Nationality.value;
        this.customer.sex = this.Sex?.value;
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
