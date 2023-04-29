import { Component, Input } from '@angular/core';
import { NavigationItem } from '../../../models/NavigationItem';

@Component({
  selector: 'app-manager-item',
  templateUrl: './manager-item.component.html',
  styleUrls: ['./manager-item.component.scss']
})
export class ManagerItemComponent {
  @Input() managerItem!: NavigationItem;
}
