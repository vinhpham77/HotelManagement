import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { RoomTypesService } from '../../../services/room-types.service';
import { RoomsService } from '../../../services/rooms.service';
import { Room } from '../../../models/Room';
import { RoomType } from '../../../models/RoomType';

@Component({
  selector: 'app-cu-room',
  templateUrl: './cu-room.component.html',
  styleUrls: ['./cu-room.component.scss']
})
export class CuRoomComponent implements OnDestroy {
  data: any;
  subscriptions: Subscription[];
  roomTypes!: RoomType[];
  isHidden = true;

  roomForm = this.fb.group({
    name: ['', Validators.required],
    roomTypeId: ['', Validators.required],
    pricePerDay: this.fb.control<number | null>(null, [Validators.min(0), Validators.required]),
    maxAdult: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    maxChild: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    description: ['']
  });

  get Name() {
    return this.roomForm.get('name');
  }

  get RoomTypeId() {
    return this.roomForm.get('roomTypeName');
  }

  get PricePerDay() {
    return this.roomForm.get('pricePerDay');
  }

  get MaxAdult() {
    return this.roomForm.get('maxAdult');
  }

  get MaxChild() {
    return this.roomForm.get('maxChild');
  }

  get Description() {
    return this.roomForm.get('description');
  }

  constructor(private fb: FormBuilder,
              private commonService: CommonService,
              private roomsService: RoomsService,
              private roomTypesService: RoomTypesService) {
    // Subscribe
    const formSubscription = this.commonService.formData$.subscribe(data => {
      this.data = data;
      this.roomForm.reset();

      if (this.data.action === 'update') {
        this.roomForm.patchValue({
          name: this.data?.object.name,
          roomTypeId: this.data?.object.roomTypeId,
          pricePerDay: this.data?.object.pricePerDay,
          maxAdult: this.data?.object.maxAdult,
          maxChild: this.data?.object.maxChild,
          description: this.data?.object.description
        });
      }

      this.isHidden = false;
    });

    const roomTypesSubscription = this.roomTypesService.roomTypes$.subscribe(data => {
      this.roomTypes = data;
    });

    this.subscriptions = [formSubscription, roomTypesSubscription];
  }

  onSave() {
    if (this.roomForm.valid) {
      if (this.data.action === 'create') {
        // @ts-ignore
        this.roomsService.create(<RoomDto>{
          name: this.Name?.value,
          roomTypeId: this.RoomTypeId?.value,
          pricePerDay: this.PricePerDay?.value,
          maxAdult: this.MaxAdult?.value,
          maxChild: this.MaxChild?.value,
          description: this.Description?.value
        }).subscribe(
          {
            next: () => {
              this.isHidden = true;
              this.roomsService.load();
              this.commonService.openSnackBar('Thêm mới thành công');
            },
            error: () => {
              this.commonService.openSnackBar('Có lỗi xảy ra. Vui lòng thử lại sau');
            }
          }
        );
      } else if (this.data.action === 'update') {
        // @ts-ignore
        this.roomsService.update(<RoomDto>{
          _id: this.data.object._id,
          name: this.Name?.value,
          roomTypeId: this.RoomTypeId?.value,
          pricePerDay: this.PricePerDay?.value,
          maxAdult: this.MaxAdult?.value,
          maxChild: this.MaxChild?.value,
          description: this.Description?.value
        }).subscribe(
          {
            next: () => {
              this.isHidden = true;
              this.roomsService.load();
              this.commonService.openSnackBar('Cập nhật thành công');
            },
            error: () => {
              this.commonService.openSnackBar('Có lỗi xảy ra. Vui lòng thử lại sau');
            }
          }
        );
      }
    } else {
      this.roomForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.isHidden = true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
