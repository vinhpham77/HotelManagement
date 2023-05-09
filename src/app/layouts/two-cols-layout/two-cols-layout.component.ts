import { Component, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { componentService } from '../../services/component.service';
import { Subscription } from 'rxjs';
import { NavigationItem } from '../../models/NavigationItem';

@Component({
  selector: 'app-two-cols-layout',
  templateUrl: './two-cols-layout.component.html',
  styleUrls: ['./two-cols-layout.component.scss']
})
export class TwoColsLayoutComponent implements OnDestroy {
  @ViewChild('target', { read: ViewContainerRef }) target!: ViewContainerRef;
  subscriptions: Subscription[];
  opened: boolean = true;
  sidenavItems: NavigationItem[] = [
    { title: 'Đặt phòng', link: '/reservation', icon: 'calendar_month' },
    { title: 'Thuê - trả phòng', link: '/check', icon: 'published_with_changes' },
    { title: 'Quản lý hệ thống', link: '/manager', icon: 'settings' },
    { title: 'Tài khoản', link: '/account', icon: 'account_circle' },
    { title: 'Đăng xuất', link: '/logout', icon: 'logout' }
  ];

  constructor(private componentService: componentService) {
    const componentSubscribe = this.componentService.component$.subscribe(component => {
      this.target.clear();
      // @ts-ignore
      this.target.createComponent(component);
    });

    this.subscriptions = [componentSubscribe];
  }

  toggle() {
    this.componentService.toggleSidenav().subscribe(toggle => {
      this.opened = toggle;
      console.log(this.opened);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
