import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { StaffService } from '../../../services/staff.service';
import { Personnel } from '../../../models/Personnel';

@Component({
  selector: 'app-cu-personnel',
  templateUrl: './cu-personnel.component.html',
  styleUrls: ['./cu-personnel.component.scss']
})
export class CuPersonnelComponent {
  data: any;
  subscription: Subscription;
  isHidden = true;

  customerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    birthdate: this.fb.control<Date | null>(null, [Validators.required]),
    sex: this.fb.control<boolean>(true, [Validators.required]),
    idNo: ['', [Validators.required]],
    phoneNumber: ['', [Validators.pattern(/^\d{10}$/)]],
    address: ['', Validators.required],
    nationality: ['', Validators.required]
  });

  get FirstName() {
    return this.customerForm.get('firstName');
  }

  get LastName() {
    return this.customerForm.get('lastName');
  }

  get Username() {
    return this.customerForm.get('username');
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

  get Address() {
    return this.customerForm.get('address');
  }

  get Nationality() {
    return this.customerForm.get('nationality');
  }

  constructor(private fb: FormBuilder, private commonService: CommonService, private staffService: StaffService) {
    this.subscription = this.commonService.formData$.subscribe(data => {
      this.data = data;
      this.customerForm.reset();
      this.Sex?.setValue(true);

      if (this.data.action === 'update') {
        let personnel = this.data?.object;
        this.customerForm.patchValue({
          firstName: personnel.firstName,
          lastName: personnel.lastName,
          username: personnel.username,
          birthdate: personnel.birthdate,
          sex: personnel.sex,
          idNo: personnel.idNo,
          phoneNumber: personnel.phoneNumber,
          address: personnel.address,
          nationality: personnel.nationality
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

      const personnel = <Personnel>{
        firstName: this.FirstName?.value,
        lastName: this.LastName?.value,
        birthdate,
        username: this.Username?.value,
        sex: this.Sex?.value,
        idNo: this.IdNo?.value,
        phoneNumber: this.PhoneNumber?.value,
        address: this.Address?.value,
        nationality: this.Nationality?.value
      };

      if (this.data.action === 'create') {
        this.staffService.create(personnel).subscribe(
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
        personnel.id = this.data.object.id;
        this.staffService.patch(personnel).subscribe(
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
    this.staffService.load();
    this.commonService.openSnackBar(msg);
  }
}
