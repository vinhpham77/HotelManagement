import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import { ManagerComponent } from '../components/manager/manager.component';
import { ThreeColsLayoutComponent } from '../layouts/three-cols-layout/three-cols-layout.component';
import { TwoColsLayoutComponent } from '../layouts/two-cols-layout/two-cols-layout.component';
import { RoomTypeComponent } from '../components/manager/room-type/room-type.component';

const appRoutes: Routes = [

  // Two Cols Layout Routes
  {
    path: '',
    component: TwoColsLayoutComponent,
    children: [
      { path: 'manager', component: ManagerComponent},
    ]
  },

  // Three Cols Layout Routes
  {
    path: '',
    component: ThreeColsLayoutComponent,
    children: [
      { path: 'roomtype', component: RoomTypeComponent},
    ]
  },

  // no layout routes
  // { path: 'login', component: LoginComponent},

  // otherwise redirect to home
  // { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes)
  ]
})
export class AppRoutesModule { }
