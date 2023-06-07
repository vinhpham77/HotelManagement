import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { StaffService } from '../../../services/staff.service';
import { Personnel } from '../../../models/Personnel';
import { AccountsService } from '../../../services/accounts.service';

@Component({
  selector: 'app-cu-personnel',
  templateUrl: './cu-personnel.component.html',
  styleUrls: ['./cu-personnel.component.scss']
})
export class CuPersonnelComponent implements OnInit {
  data: any;
  subscriptions: Subscription[];
  usernames = [];
  isHidden = true;

  personnelForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    username: ['', Validators.required],
    birthdate: this.fb.control<Date | null>(null, [Validators.required]),
    sex: this.fb.control<boolean>(true, [Validators.required]),
    idNo: ['', [Validators.required]],
    phoneNumber: ['', [Validators.pattern(/^\d{10}$/)]],
    nationality: ['', Validators.required]
  });

  get FirstName() {
    return this.personnelForm.get('firstName');
  }

  get LastName() {
    return this.personnelForm.get('lastName');
  }

  get Username() {
    return this.personnelForm.get('username');
  }

  get Birthdate() {
    return this.personnelForm.get('birthdate');
  }

  get Sex() {
    return this.personnelForm.get('sex');
  }

  get IdNo() {
    return this.personnelForm.get('idNo');
  }

  get PhoneNumber() {
    return this.personnelForm.get('phoneNumber');
  }

  get Nationality() {
    return this.personnelForm.get('nationality');
  }

  constructor(private fb: FormBuilder, private commonService: CommonService, private staffService: StaffService, private accountService: AccountsService) {
    const usernameSubscription = this.accountService.getUsernames().subscribe(usernames => {
      this.usernames = usernames;
    });

    this.subscriptions = [usernameSubscription];
  }

  ngOnInit() {
    const formSubscription = this.commonService.formData$.subscribe(data => {
      this.data = data;
      this.personnelForm.reset();
      this.Sex?.setValue(true);

      if (this.data.action === 'update') {
        let personnel = this.data?.object;
        this.personnelForm.patchValue({
          firstName: personnel.firstName,
          lastName: personnel.lastName,
          username: personnel.username,
          birthdate: personnel.birthdate,
          sex: personnel.sex,
          idNo: personnel.idNo,
          phoneNumber: personnel.phoneNumber,
          nationality: personnel.nationality
        });
      } else if (this.data.action === 'create') {
        this.Sex?.setValue(true);
        this.Nationality?.setValue('Việt Nam');
      }

      this.isHidden = false;
    });

    this.subscriptions.push(formSubscription);
  }

  onSave() {
    if (this.personnelForm.valid) {
      let birthdate = new Date(this.Birthdate?.value as Date).toISOString();

      const personnel = <Personnel>{
        firstName: this.FirstName?.value,
        lastName: this.LastName?.value,
        birthdate,
        username: this.Username?.value,
        sex: this.Sex?.value,
        idNo: this.IdNo?.value,
        phoneNumber: this.PhoneNumber?.value,
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
        this.staffService.update(personnel).subscribe(
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
      this.personnelForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.isHidden = true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  refreshOnSuccess(msg: string) {
    this.isHidden = true;
    this.staffService.load();
    this.commonService.openSnackBar(msg);
  }
}
