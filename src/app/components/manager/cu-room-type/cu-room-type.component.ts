import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { Subscription } from 'rxjs';
import { RoomTypesService } from '../../../services/room-types.service';
import { RoomType } from '../../../models/RoomType';

@Component({
  selector: 'app-cu-room-type',
  templateUrl: './cu-room-type.component.html',
  styleUrls: ['./cu-room-type.component.scss']
})
export class CuRoomTypeComponent implements OnDestroy {
  data: any;
  subscription: Subscription;
  isHidden = true;

  roomTypeForm = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  get Name() {
    return this.roomTypeForm.get('name');
  }

  get Description() {
    return this.roomTypeForm.get('description');
  }

  constructor(private fb: FormBuilder, private commonService: CommonService, private roomTypeService: RoomTypesService) {
    this.subscription = this.commonService.formData$.subscribe(data => {
      this.data = data;
      this.roomTypeForm.reset();

      if (this.data.action === 'update') {
        this.roomTypeForm.patchValue({
          name: this.data?.object.name,
          description: this.data?.object.description
        });
      }

      this.isHidden = false;
    });
  }

  onSave() {
    if (this.roomTypeForm.valid) {
      if (this.data.action === 'create') {
        this.roomTypeService.create(<RoomType>{
          name: this.Name?.value,
          description: this.Description?.value
        }).subscribe(
          {
            next: () => {
              this.isHidden = true;
              this.roomTypeService.load();
              this.commonService.openSnackBar('Thêm mới thành công');
            },
            error: () => {
              this.commonService.openSnackBar('Có lỗi xảy ra. Vui lòng thử lại sau');
            }
          }
        );
      } else if (this.data.action === 'update') {
        this.roomTypeService.update(<RoomType>{
          id: this.data.object.id,
          name: this.Name?.value,
          description: this.Description?.value
        }).subscribe(
          {
            next: () => {
              this.isHidden = true;
              this.roomTypeService.load();
              this.commonService.openSnackBar('Cập nhật thành công');
            },
            error: () => {
              this.commonService.openSnackBar('Có lỗi xảy ra. Vui lòng thử lại sau');
            }
          }
        );
      }
    } else {
      this.roomTypeForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.isHidden = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
