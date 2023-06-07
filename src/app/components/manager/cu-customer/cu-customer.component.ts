import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { CustomersService } from '../../../services/customers.service';
import { Customer } from '../../../models/Customer';

@Component({
  selector: 'app-cu-customer',
  templateUrl: './cu-customer.component.html',
  styleUrls: ['./cu-customer.component.scss']
})
export class CuCustomerComponent implements OnDestroy {
  data: any;
  subscription: Subscription;
  isHidden = true;

  customerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthdate: this.fb.control<Date | null>(null, [Validators.required]),
    sex: this.fb.control<boolean>(true, [Validators.required]),
    idNo: ['', [Validators.required]],
    phoneNumber: ['', [Validators.pattern(/^\d{10}$/)]],
    nationality: ['', Validators.required]
  });

  get FirstName() {
    return this.customerForm.get('firstName');
  }

  get LastName() {
    return this.customerForm.get('lastName');
  }

  get Birthdate() {
    return this.customerForm.get('birthdate');
  }

  get Sex() {
    return this.customerForm.get('sex');
  }

  get IdNo() {
    return this.customerForm.get('idNo');
  }

  get PhoneNumber() {
    return this.customerForm.get('phoneNumber');
  }

  get Nationality() {
    return this.customerForm.get('nationality');
  }

  constructor(private fb: FormBuilder, private commonService: CommonService, private customersService: CustomersService) {
    this.subscription = this.commonService.formData$.subscribe(data => {
      this.data = data;
      this.customerForm.reset();

      if (this.data.action === 'update') {
        let customer = this.data?.object;
        this.customerForm.patchValue({
          firstName: customer.firstName,
          lastName: customer.lastName,
          birthdate: customer.birthdate,
          sex: customer.sex,
          idNo: customer.idNo,
          phoneNumber: customer.phoneNumber,
          nationality: customer.nationality
        });
      } else if (this.data.action === 'create') {
        this.Sex?.setValue(true);
        this.Nationality?.setValue('Việt Nam');
      }

      this.isHidden = false;
    });
  }

  onSave() {
    if (this.customerForm.valid) {
      let birthdate = new Date(this.Birthdate?.value as Date).toISOString();

      const customer = <Customer>{
        firstName: this.FirstName?.value,
        lastName: this.LastName?.value,
        birthdate,
        sex: this.Sex?.value,
        idNo: this.IdNo?.value,
        phoneNumber: this.PhoneNumber?.value,
        nationality: this.Nationality?.value
      };

      if (this.data.action === 'create') {
        this.customersService.create(customer).subscribe(
          {
            next: () => {
              this.refreshOnSuccess('Thêm mới thành công');
            },
            error: () => {
              this.commonService.openSnackBar('Có lỗi xảy ra. Vui lòng thử lại sau');
            }
          }
        );
      } else if (this.data.action === 'update') {
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
      this.customerForm.markAllAsTouched();
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
