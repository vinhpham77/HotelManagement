import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class componentService {

  private componentSource = new Subject<null>();

  component$ = this.componentSource.asObservable();

  notifyComponent(component: any) {
    this.componentSource.next(component);
  }
}
