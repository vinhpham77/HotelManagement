import { Component, Inject } from '@angular/core';
import { MenuItem } from 'src/app/models/MenuItem';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MenuService } from 'src/app/services/menu.service';
import { Order } from 'src/app/models/order';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  public menus!: MenuItem[];
  constructor(private _bottomSheetRef: MatBottomSheetRef<MenuComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Order,
    private menuService: MenuService,
    ) {
      this.menuService.menu$.subscribe(result => this.menus = result);
      this.menuService.uploadMenuAll;
  }

  selectItem(event: MouseEvent, item: MenuItem): void {
    this._bottomSheetRef.dismiss(item);
    event.preventDefault();
  }

  hadItem(id: string): boolean {
    let item = this.data.details.find(each => each.itemId === id);
    return item? true:false;
  }
}
