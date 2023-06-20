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
import { LoginComponent } from '../components/auth/login/login.component';
import { LogoutComponent } from '../components/auth/logout/logout.component';
import { HomeComponent } from '../components/home/home.component';
import { NotFoundComponent } from '../components/auth/not-found/not-found.component';
import { ForbiddenComponent } from '../components/auth/forbidden/forbidden.component';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';

const appRoutes: Routes = [

  // Two Cols Layout Routes
  {
    path: '',
    component: TwoColsLayoutComponent,
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent, title: 'Trang chủ', canActivate: [AuthGuard] },
      {
        path: 'manager',
        component: ManagerComponent,
        title: 'Quản lý hệ thống',
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: ['admin'] }
      },
      {
        path: 'check',
        component: RentComponent,
        title: 'Thuê - Trả phòng',
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: ['admin', 'personnel'] }
      },
      {
        path: 'booking',
        component: BookRoomComponent,
        title: 'Đặt phòng',
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: ['admin', 'personnel'] }
      }
    ]
  },

  // Three Cols Layout Routes
  {
    path: '',
    component: ThreeColsLayoutComponent,
    children: [
      {
        path: 'manager/roomtypes',
        component: RoomTypesComponent,
        title: 'Loại phòng',
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: ['admin'] }
      },
      {
        path: 'manager/rooms',
        component: RoomsComponent,
        title: 'Phòng',
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: ['admin'] }
      },
      {
        path: 'manager/menu',
        component: MenuComponent,
        title: 'Menu',
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: ['admin'] }
      },
      {
        path: 'manager/customers',
        component: CustomersComponent,
        title: 'Khách hàng',
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: ['admin'] }
      },
      {
        path: 'manager/staff',
        component: StaffComponent,
        title: 'Nhân sự',
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: ['admin'] }
      },
      {
        path: 'manager/accounts',
        component: AccountsComponent,
        title: 'Tài khoản',
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: ['admin'] }
      },
      {
        path: 'manager/receipts',
        component: ReceiptsComponent,
        title: 'Hóa đơn',
        canActivate: [AuthGuard, RoleGuard],
        data: { expectedRoles: ['admin'] }
      }
    ]
  },

  // No layout routes
  {
    path: 'auth/login',
    component: LoginComponent,
    title: 'Đăng nhập'
  },
  {
    path: 'auth/logout',
    component: LogoutComponent,
    title: 'Đăng xuất'
  },
  {
    path: 'auth/not-found',
    component: NotFoundComponent,
    title: 'Không tìm thấy trang'
  },
  {
    path: 'auth/forbidden',
    component: ForbiddenComponent,
    title: 'Không có quyền truy cập'
  },
  {
    path: '**',
    redirectTo: '/auth/not-found',
    pathMatch: 'full'
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
