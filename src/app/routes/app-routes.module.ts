import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ManagerComponent } from '../components/manager/manager.component';
import { ThreeColsLayoutComponent } from '../layouts/three-cols-layout/three-cols-layout.component';
import { TwoColsLayoutComponent } from '../layouts/two-cols-layout/two-cols-layout.component';
import { RoomTypesComponent } from '../components/manager/room-types/room-types.component';
import { RoomsComponent } from '../components/manager/rooms/rooms.component';
import { MenuComponent } from '../components/manager/menu/menu.component';
import { CustomersComponent } from '../components/manager/customers/customers.component';
import { StaffComponent } from '../components/manager/staff/staff.component';
import { RentComponent } from '../components/rent/rent.component';
import { AccountsComponent } from '../components/manager/accounts/accounts.component';
import { ReceiptsComponent } from '../components/manager/receipts/receipts.component';
import { BookRoomComponent } from '../components/book-room/book-room.component';


const appRoutes: Routes = [

  // Two Cols Layout Routes
  {
    path: '',
    component: TwoColsLayoutComponent,
    children: [
      { path: 'manager', component: ManagerComponent, title: 'Quản lý hệ thống' },
      { path: 'check', component: RentComponent, title: 'Thuê - Trả phòng'},
      { path: 'booking', component: BookRoomComponent, title: 'Đặt phòng'}
    ]
  },

  // Three Cols Layout Routes
  {
    path: '',
    component: ThreeColsLayoutComponent,
    children: [
      { path: 'manager/roomtypes', component: RoomTypesComponent, title: 'Loại phòng' },
      { path: 'manager/rooms', component: RoomsComponent, title: 'Phòng' },
      { path: 'manager/menu', component: MenuComponent, title: 'Menu' },
      { path: 'manager/customers', component: CustomersComponent, title: 'Khách hàng' },
      { path: 'manager/staff', component: StaffComponent, title: 'Nhân sự' },
      { path: 'manager/accounts', component: AccountsComponent, title: 'Tài khoản' },
      { path: 'manager/receipts', component: ReceiptsComponent, title: 'Hóa đơn'}
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutesModule {
}
