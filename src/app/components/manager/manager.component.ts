import { Component } from '@angular/core';
import { NavigationItem } from '../../models/NavigationItem';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})

export class ManagerComponent {
  managerItems: NavigationItem[] = [
    { title: 'Loại phòng', link: './roomtypes', icon: 'class' },
    { title: 'Phòng', link: './rooms', icon: 'hotel' },
    { title: 'Menu', link: './menu', icon: 'fastfood' },
    { title: 'Khách hàng', link: './customers', icon: 'badge' },
    { title: 'Nhân sự', link: './staff', icon: 'contacts' },
    { title: 'Thống kê', link: './reports', icon: 'analytics' },
    { title: 'Hóa đơn', link: './receipts', icon: 'receipt' },
    { title: 'Thiết lập khác', link: './configs', icon: 'room_preferences' }
  ];

}
