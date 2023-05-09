import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationItem } from '../../models/NavigationItem';
import { componentService} from '../../services/component.service';

@Component({
  selector: 'app-three-cols-layout',
  templateUrl: './three-cols-layout.component.html',
  styleUrls: ['./three-cols-layout.component.scss']
})
export class ThreeColsLayoutComponent {
  @ViewChild('target', { read: ViewContainerRef }) target!: ViewContainerRef;
  subscription: Subscription;
  opened: boolean = true;
  sidenavItems: NavigationItem[] = [
    {title: 'Đặt phòng', link: '/reservation', icon: 'calendar_month'},
    {title: 'Thuê - trả phòng', link: '/check', icon: 'published_with_changes'},
    {title: 'Quản lý hệ thống', link: '/manager', icon: 'settings'},
    {title: 'Tài khoản', link: '/account', icon: 'account_circle'},
    {title: 'Đăng xuất', link: '/logout', icon: 'logout'}
  ];

  constructor(private componentService: componentService) {
    this.subscription = this.componentService.component$.subscribe(component => {
      this.target.clear();
      // @ts-ignore
      this.target.createComponent(component);
    })
  }

  toggle() {
    this.componentService.toggleSidenav().subscribe(toggle => {
      this.opened = toggle;
      console.log(this.opened);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
