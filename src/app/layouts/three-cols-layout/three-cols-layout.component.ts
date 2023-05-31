import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NavigationItem } from '../../models/NavigationItem';
import { CommonService } from '../../services/common.service';
import { FormDirective } from '../../directives/form.directive';
import { CustomTitleService } from '../../services/custom-title.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-three-cols-layout',
  templateUrl: './three-cols-layout.component.html',
  styleUrls: ['./three-cols-layout.component.scss']
})
export class ThreeColsLayoutComponent implements OnDestroy {
  @ViewChild(FormDirective, { static: true }) formHost!: FormDirective;
  subscriptions: Subscription[] = [];
  title: string = '';
  opened: boolean = true;
  sidenavItems: NavigationItem[] = [
    { title: 'Đặt phòng', link: '/reservation', icon: 'calendar_month' },
    { title: 'Thuê - trả phòng', link: '/check', icon: 'published_with_changes' },
    { title: 'Quản lý hệ thống', link: '/manager', icon: 'settings' },
    { title: 'Tài khoản', link: '/account', icon: 'account_circle' },
    { title: 'Đăng xuất', link: '/logout', icon: 'logout' }
  ];

  constructor(private customTitleService: CustomTitleService, private commonService: CommonService) {
    // Subscribe to services
    const titleSubscription = this.customTitleService.title$.subscribe(title => {
      this.title = title;
    });
    const formSubscription = this.commonService.form$.subscribe(form => {
      this.formHost.viewContainerRef.createComponent(form);
    });
    const sidenavOpenedSubscription = this.commonService.sidenavOpened$.subscribe(opened => {
      this.opened = opened;
    });

    // Push to subscriptions
    this.subscriptions.push(titleSubscription);
    this.subscriptions.push(formSubscription);
    this.subscriptions.push(sidenavOpenedSubscription);
  }

  toggle() {
    this.commonService.toggleSidenav(!this.opened);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
