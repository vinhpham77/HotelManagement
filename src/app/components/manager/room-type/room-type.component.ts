import { Component, OnDestroy } from '@angular/core';
import { RoomTypeService } from '../../../services/room-type.service';
import { Subscription } from 'rxjs';
import { RoomType } from '../../../models/RoomType';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss']
})
export class RoomTypeComponent implements OnDestroy {
  dataSource!: MatTableDataSource<RoomType>;
  displayedColumns: string[] = ['select', 'name', 'description', 'actions'];
  subscription = new Subscription();
  selections = new SelectionModel<RoomType>(true, []);
  searchValue: string = '';

  isAllSelected() {
    const numSelected = this.selections.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selections.clear();
      return;
    }

    this.selections.select(...this.dataSource.data);
  }

  constructor(private roomTypeService: RoomTypeService) {
    this.subscription = this.roomTypeService.roomTypes$.subscribe(roomTypes => {
      this.dataSource = new MatTableDataSource(roomTypes);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
