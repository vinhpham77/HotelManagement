import { Component, OnDestroy } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NavigationItem } from '../../models/NavigationItem';
import { CustomTitleService } from '../../services/custom-title.service';
import { Subscription } from 'rxjs';
import { SidenavService } from '../../services/sidenav.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-two-cols-layout',
  templateUrl: './two-cols-layout.component.html',
  styleUrls: ['./two-cols-layout.component.scss']
})
export class TwoColsLayoutComponent implements OnDestroy {
  subscriptions: Subscription[] = [];
  title!: string;
  fullName: string = '';
  opened: boolean = true;
  sidenavItems: NavigationItem[] = [];

  constructor(private commonService: CommonService, private customTitleService: CustomTitleService, private sidenavService: SidenavService, private AuthService: AuthService) {
    // Subscribe to services
    const titleSubscription = this.customTitleService.title$.subscribe(title => {
      this.title = title;
    });
    const sideNavSubscription = this.commonService.sidenavOpened$.subscribe(opened => {
      this.opened = opened;
    });
    const sidenavItemsSubscription = this.sidenavService.sidenavItems$.subscribe(items => {
      this.sidenavItems = items;
    });

    this.fullName = this.AuthService.FullName;

      // Push to subscriptions
      this.subscriptions.push(titleSubscription);
    this.subscriptions.push(sideNavSubscription);
    this.subscriptions.push(sidenavItemsSubscription);
  }

  toggle() {
    this.commonService.toggleSidenav(!this.opened);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
