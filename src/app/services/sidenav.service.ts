import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavigationItem } from '../models/NavigationItem';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  private sidenavItemsSource = new BehaviorSubject<NavigationItem[]>([]);
  sidenavItems$ = this.sidenavItemsSource.asObservable();

  constructor(private authService: AuthService) {
    this.loadSidenavItems();
  }

  private set sidenavItems(value: NavigationItem[]) {
    this.sidenavItemsSource.next(value);
  }

  loadSidenavItems() {
    if (this.authService.Role === 'personnel') {
      this.sidenavItems = [
        { title: 'Trang chủ', link: '/home', icon: 'home' },
        { title: 'Đặt phòng', link: '/booking', icon: 'calendar_month' },
        { title: 'Thuê - trả phòng', link: '/check', icon: 'published_with_changes' },
        { title: 'Đăng xuất', link: '/auth/logout', icon: 'logout' }
      ];
    } else if (this.authService.Role === 'admin') {
      this.sidenavItems = [
        { title: 'Trang chủ', link: '/home', icon: 'home' },
        { title: 'Đặt phòng', link: '/booking', icon: 'calendar_month' },
        { title: 'Thuê - trả phòng', link: '/check', icon: 'published_with_changes' },
        { title: 'Quản lý hệ thống', link: '/manager', icon: 'settings' },
        { title: 'Đăng xuất', link: '/auth/logout', icon: 'logout' }
      ];
    }
  }
}
