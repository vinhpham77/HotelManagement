import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NavigationItem } from '../../models/NavigationItem';
import { CommonService } from '../../services/common.service';
import { FormDirective } from '../../directives/form.directive';
import { CustomTitleService } from '../../services/custom-title.service';
import { Subscription } from 'rxjs';
import { SidenavService } from '../../services/sidenav.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-three-cols-layout',
  templateUrl: './three-cols-layout.component.html',
  styleUrls: ['./three-cols-layout.component.scss']
})
export class ThreeColsLayoutComponent implements OnDestroy {
  @ViewChild(FormDirective, { static: true }) formHost!: FormDirective;
  subscriptions: Subscription[] = [];
  title: string = '';
  fullName: string = '';
  opened: boolean = true;
  sidenavItems: NavigationItem[] = [];

  constructor(private customTitleService: CustomTitleService, private commonService: CommonService, private sidenavService: SidenavService, private AuthService: AuthService) {
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
    const sidenavItemsSubscription = this.sidenavService.sidenavItems$.subscribe(items => {
      this.sidenavItems = items;
    });

    this.fullName = this.AuthService.FullName;

    // Push to subscriptions
    this.subscriptions.push(titleSubscription);
    this.subscriptions.push(formSubscription);
    this.subscriptions.push(sidenavOpenedSubscription);
    this.subscriptions.push(sidenavItemsSubscription);
  }

  toggle() {
    this.commonService.toggleSidenav(!this.opened);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
