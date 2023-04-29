import { Component, OnDestroy } from '@angular/core';
import { RoomTypeService } from '../../../services/room-type.service';
import { Subscription } from 'rxjs';
import { RoomType } from '../../../models/RoomType';

@Component({
  selector: 'app-room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss']
})
export class RoomTypeComponent implements OnDestroy {
  dataSource!: RoomType[];
  displayedColumns: string[] = ['name', 'description', 'actions'];
  subscription = new Subscription();
  searchValue: string = '';

  constructor(private roomTypeService: RoomTypeService) {
    this.subscription = this.roomTypeService.roomTypes$.subscribe(roomTypes => {
      this.dataSource = roomTypes;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
