import { Component } from '@angular/core';
import { NavigationItem } from '../../models/NavigationItem';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss']
})

export class ManagerComponent {
  managerItems: NavigationItem[] = [
    { title: 'Loại phòng', link: '/roomtype', icon: 'home' },
    { title: 'Phòng', link: '/room', icon: 'hotel' },
    { title: 'Menu', link: '/menu', icon: 'fastfood' },
    { title: 'Khách hàng', link: '/customer', icon: 'badge' },
    { title: 'Nhân viên', link: '/staff', icon: 'contacts' },
    { title: 'Thống kê', link: '/report', icon: 'analytics' },
    { title: 'Hóa đơn', link: '/receipt', icon: 'receipt' },
    { title: 'Thiết lập khác', link: '/config', icon: 'room_preferences' }
  ];

}
