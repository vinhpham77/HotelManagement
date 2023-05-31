import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ManagerComponent } from '../components/manager/manager.component';
import { ThreeColsLayoutComponent } from '../layouts/three-cols-layout/three-cols-layout.component';
import { TwoColsLayoutComponent } from '../layouts/two-cols-layout/two-cols-layout.component';
import { RoomTypesComponent } from '../components/manager/room-types/room-types.component';
import { RoomsComponent } from '../components/manager/rooms/rooms.component';
import { MenuComponent } from '../components/manager/menu/menu.component';

const appRoutes: Routes = [

  // Two Cols Layout Routes
  {
    path: '',
    component: TwoColsLayoutComponent,
    children: [
      { path: 'manager', component: ManagerComponent, title: 'Quản lý hệ thống' }
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
