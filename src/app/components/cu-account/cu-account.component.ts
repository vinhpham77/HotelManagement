import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { AccountsService } from '../../services/accounts.service';
import { Account } from '../../models/Account';

import { accountRoles } from '../../../assets/accountRoles';

@Component({
  selector: 'app-cu-account',
  templateUrl: './cu-account.component.html',
  styleUrls: ['./cu-account.component.scss']
})
export class CuAccountComponent {
  data: any;
  subscriptions: Subscription[] = [];
  isHidden = true;
  roles = accountRoles;
  accountForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    repeatPassword: ['', [Validators.required, this.compareValidator('password')]],
    role: ['', Validators.required],
    status: [true]
  });

  get Username() {
    return this.accountForm.get('username');
  }

  get Password() {
    return this.accountForm.get('password');
  }

  get RepeatPassword() {
    return this.accountForm.get('repeatPassword');
  }

  get Role() {
    return this.accountForm.get('role');
  }

  get Status() {
    return this.accountForm.get('status');
  }

  constructor(private fb: FormBuilder, private commonService: CommonService, private accountsService: AccountsService, private accountService: AccountsService) {
  }

  ngOnInit() {
    const formSubscription = this.commonService.formData$.subscribe(data => {
      this.data = data;
      this.accountForm.reset();

      if (this.data.action === 'update') {
        let account = this.data?.object;
        this.Username?.disable();
        this.accountForm.patchValue({
          username: account.username,
          role: account.role,
          status: account.status
        });
      } else if (this.data.action === 'create') {
        this.Username?.enable();
        this.Status?.setValue(true);
      }

      this.isHidden = false;
    });

    this.subscriptions.push(formSubscription);
  }

  onSave() {
    if (this.accountForm.valid) {
      const account = <Account>{
        username: this.Username?.value,
        password: this.Password?.value,
        role: this.Role?.value,
        status: this.Status?.value
      };

      if (this.data.action === 'create') {
        this.accountsService.create(account).subscribe(
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
        account.id = this.data.object.id;
        this.accountsService.update(account).subscribe(
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
      this.accountForm.markAllAsTouched();
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
    this.accountsService.load();
    this.commonService.openSnackBar(msg);
  }

  compareValidator(compareControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const compareControl = control.root.get(compareControlName);
      if (!compareControl) {
        return null;
      }
      if (control.value !== compareControl.value) {
        return { compare: true };
      }
      return null;
    };
  }

  protected readonly accountRoles = accountRoles;
}
