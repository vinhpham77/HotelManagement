import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Menu } from '../models/menu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menus: Menu[] = [
    { id: '1', name: '7Up', type: 'drinks', importPrice: 10000, price: 150000, },
  ];

  menusSource = new BehaviorSubject<Menu[]>(this.menus);

  menusSource$ = this.menusSource.asObservable();

  get Menus() {
    return this.menusSource.next(this.menus);
  }
}
