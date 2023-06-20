import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Customer } from 'src/app/models/Customer';
import { CommonService } from 'src/app/services/common.service';
import { CustomersService } from 'src/app/services/customers.service';

@Component({
  selector: 'app-add-person',
  templateUrl: './add-person.component.html',
  styleUrls: ['./add-person.component.scss'],
})
export class AddPersonComponent {
  subscription: Subscription;
  isHidden = false;

  customerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    birthdate: this.fb.control<Date | null>(null, [Validators.required]),
    sex: this.fb.control<boolean>(true, [Validators.required]),
    idNo: ['', [Validators.required]],
    phoneNumber: ['', [Validators.pattern(/^\d{10}$/)]],
    nationality: ['', Validators.required],
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

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private customersService: CustomersService
  ) {
    this.subscription = this.commonService.formData$.subscribe((data) => {
      this.customerForm.reset();

      this.Sex?.setValue(true);
      this.Nationality?.setValue('Việt Nam');

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
        nationality: this.Nationality?.value,
      };

      this.customersService.create(customer).subscribe({
        next: () => {
          this.refreshOnSuccess('Thêm mới thành công');
        },
        error: () => {
          this.commonService.openSnackBar(
            'Có lỗi xảy ra. Vui lòng thử lại sau'
          );
        },
      });

    } else {
      this.customerForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.customerForm.reset();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refreshOnSuccess(msg: string) {
    this.commonService.openSnackBar(msg);
  }
}
