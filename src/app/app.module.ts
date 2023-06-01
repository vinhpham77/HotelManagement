import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, TitleStrategy } from '@angular/router';
import { AppRoutesModule } from './routes/app-routes.module';

import { AppComponent } from './app.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ManagerComponent } from './components/manager/manager.component';
import { ManagerItemComponent } from './components/manager/manager-item/manager-item.component';
import { MatCardModule } from '@angular/material/card';
import { TwoColsLayoutComponent } from './layouts/two-cols-layout/two-cols-layout.component';
import { ThreeColsLayoutComponent } from './layouts/three-cols-layout/three-cols-layout.component';
import { RoomTypesComponent } from './components/manager/room-types/room-types.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomMatPaginatorIntlService } from './services/custom-mat-paginator-intl.service';
import { DialogComponent } from './components/dialog/dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CuRoomTypeComponent } from './components/manager/cu-room-type/cu-room-type.component';
import { FormDirective } from './directives/form.directive';
import { MatSelectModule } from '@angular/material/select';
import { CommonService } from './services/common.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoomsComponent } from './components/manager/rooms/rooms.component';
import { CuRoomComponent } from './components/manager/cu-room/cu-room.component';
import { MenuComponent } from './components/manager/menu/menu.component';
import { CuMenuItemComponent } from './components/manager/cu-menu-item/cu-menu-item.component';
import { CustomTitleService } from './services/custom-title.service';
import { CurrencyFormatterDirective } from './directives/currency-formatter.directive';
import { CurrencyPipe } from '@angular/common';
import { MenuItemNamePipe } from './pipes/menu-item-name.pipe';
import { CuCustomerComponent } from './components/manager/cu-customer/cu-customer.component';
import { CustomersComponent } from './components/manager/customers/customers.component';

@NgModule({
  declarations: [
    AppComponent,
    ManagerComponent,
    ManagerItemComponent,
    TwoColsLayoutComponent,
    ThreeColsLayoutComponent,
    RoomTypesComponent,
    DialogComponent,
    CuRoomTypeComponent,
    FormDirective,
    CurrencyFormatterDirective,
    RoomsComponent,
    CuRoomComponent,
    MenuComponent,
    CuMenuItemComponent,
    MenuItemNamePipe,
    CuCustomerComponent,
    CustomersComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterOutlet,
    AppRoutesModule,
    RouterLink,
    RouterLinkActive,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatDialogModule,
    HttpClientModule,
    MatSortModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlService },
    { provide: TitleStrategy, useExisting: CustomTitleService },
    MatSnackBar,
    CommonService,
    CurrencyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
