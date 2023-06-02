import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { MenuService } from '../../../services/menu.service';
import { MenuItem } from '../../../models/MenuItem';

@Component({
  selector: 'app-cu-menu-item',
  templateUrl: './cu-menu-item.component.html',
  styleUrls: ['./cu-menu-item.component.scss']
})
export class CuMenuItemComponent implements OnDestroy {
  data: any;
  subscription: Subscription;
  isHidden = true;

  menuItemForm = this.fb.group({
    name: ['', Validators.required],
    type: this.fb.control<boolean | null>(null, Validators.required),
    importPrice: this.fb.control<number | null>(null, [Validators.min(0), Validators.maxLength(9), Validators.required]),
    exportPrice: this.fb.control<number | null>(null, [Validators.min(0), Validators.maxLength(9), Validators.required])
  });

  get Name() {
    return this.menuItemForm.get('name');
  }

  get Type() {
    return this.menuItemForm.get('type');
  }

  get ImportPrice() {
    return this.menuItemForm.get('importPrice');
  }

  get ExportPrice() {
    return this.menuItemForm.get('exportPrice');
  }

  constructor(private fb: FormBuilder, private commonService: CommonService, private menuService: MenuService) {
    this.subscription = this.commonService.formData$.subscribe(data => {
      this.data = data;
      this.menuItemForm.reset();

      if (this.data.action === 'update') {
        let type = this.data?.object.type ?? 'null';
        let importPrice = this.commonService.convertToCurrency(this.data?.object.importPrice);
        let exportPrice = this.commonService.convertToCurrency(this.data?.object.exportPrice);

        this.menuItemForm.patchValue({
          name: this.data?.object.name,
          type,
          importPrice,
          exportPrice
        });
      }

      this.isHidden = false;
    });
  }

  onSave() {
    if (this.menuItemForm.valid) {
      let importPrice = this.commonService.convertToNumber(this.ImportPrice?.value);
      let exportPrice = this.commonService.convertToNumber(this.ExportPrice?.value);
      let type = typeof this.Type?.value === 'boolean' ? this.Type?.value : null;
      let menuItem = <MenuItem>{
        name: this.Name?.value,
        type,
        importPrice,
        exportPrice
      };
      if (this.data.action === 'create') {
        this.menuService.create(menuItem).subscribe(
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
        menuItem.id = this.data.object.id;
        this.menuService.update(menuItem).subscribe(
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
      this.menuItemForm.markAllAsTouched();
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
    this.menuService.load();
    this.commonService.openSnackBar(msg);
  }
}
