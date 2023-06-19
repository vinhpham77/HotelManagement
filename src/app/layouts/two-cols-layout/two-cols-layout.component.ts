import { Component, OnDestroy } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NavigationItem } from '../../models/NavigationItem';
import { CustomTitleService } from '../../services/custom-title.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-two-cols-layout',
  templateUrl: './two-cols-layout.component.html',
  styleUrls: ['./two-cols-layout.component.scss']
})
export class TwoColsLayoutComponent implements OnDestroy {
  subscriptions: Subscription[] = [];
  title!: string;
  opened: boolean = true;
  sidenavItems: NavigationItem[] = [
    { title: 'Đặt phòng', link: '/booking', icon: 'calendar_month' },
    { title: 'Thuê - trả phòng', link: '/check', icon: 'published_with_changes' },
    { title: 'Quản lý hệ thống', link: '/manager', icon: 'settings' },
    { title: 'Tài khoản', link: '/account', icon: 'account_circle' },
    { title: 'Đăng xuất', link: '/logout', icon: 'logout' }
  ];

  constructor(private commonService: CommonService, private customTitleService: CustomTitleService) {
    // Subscribe to services
    const titleSubscription = this.customTitleService.title$.subscribe(title => {
      this.title = title;
    });
    const sideNavSubscription = this.commonService.sidenavOpened$.subscribe(opened => {
      this.opened = opened;
    });

    // Push to subscriptions
    this.subscriptions.push(titleSubscription);
    this.subscriptions.push(sideNavSubscription);
  }

  toggle() {
    this.commonService.toggleSidenav(!this.opened);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
