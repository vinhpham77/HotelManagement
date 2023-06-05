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
    return this.roomForm.get('roomTypeId');
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

    const roomTypesSubscription = this.roomTypesService.roomTypes$.subscribe(data => {
      this.roomTypes = data;
    });

    this.subscriptions = [roomTypesSubscription];
  }

  ngOnInit() {
    this.roomTypesService.uploadRoomTypeAll();
    const formSubscription = this.commonService.formData$.subscribe(data => {
      this.data = data;
      this.roomForm.reset();

      if (this.data.action === 'update') {
        let pricePerDay = this.commonService.convertToCurrency(this.data?.object.pricePerDay);
        this.roomForm.patchValue({
          name: this.data?.object.name,
          roomTypeId: this.data?.object.roomTypeId,
          pricePerDay,
          maxAdult: this.data?.object.maxAdult,
          maxChild: this.data?.object.maxChild,
          description: this.data?.object.description
        });
      }

      this.isHidden = false;

    });

    this.subscriptions.push(formSubscription);
  }

  onSave() {
    if (this.roomForm.valid) {
      let pricePerDay = this.commonService.convertToNumber(this.PricePerDay?.value);
      let room = <Room> {
        name: this.Name?.value,
        roomTypeId: this.RoomTypeId?.value,
        pricePerDay,
        maxAdult: this.MaxAdult?.value,
        maxChild: this.MaxChild?.value,
        description: this.Description?.value
      };
      if (this.data.action === 'create') {
        room.isEmpty = true;
        room.isCleaned = true;
        room.lastCleanedAt = new Date();
        this.roomsService.create(room).subscribe(
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
        room.id = this.data.object.id;
        this.roomsService.patch(room).subscribe(
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
      this.roomForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.isHidden = true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  refreshOnSuccess(msg: string) {
    this.roomsService.load();
    this.isHidden = true;
    this.commonService.openSnackBar(msg);
  }
}
