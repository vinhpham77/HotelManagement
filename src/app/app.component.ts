import {Component, ViewEncapsulation} from '@angular/core';
import {NavigationItem} from "./models/NavigationItem";
import {AppRoutesModule} from "./routes/app-routes.module";
import {Router} from "@angular/router";
import {environment} from '../environments/environment.development';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  title = 'HotelManagement';

  sidenavItems: NavigationItem[] = [
    {title: 'Đặt phòng', link: '/reservation', icon: 'calendar_month'},
    {title: 'Thuê - trả phòng', link: '/check', icon: 'published_with_changes'},
    {title: 'Quản lý hệ thống', link: '/manager', icon: 'settings'},
    {title: 'Tài khoản', link: '/account', icon: 'account_circle'},
    {title: 'Đăng xuất', link: '/logout', icon: 'logout'}
  ];

}
