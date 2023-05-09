import { Injectable } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class componentService {
  private sidenavToggle = true;
  private componentSource = new Subject<null>();

  component$ = this.componentSource.asObservable();

  toggleSidenav() {
    this.sidenavToggle = !this.sidenavToggle;
    return of(this.sidenavToggle);
  }

  notifyComponent(component: any) {
    this.componentSource.next(component);
  }
}
