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
import { RentComponent } from './components/rent/rent.component';
import {MatTabsModule} from '@angular/material/tabs';
import { CardHistoryComponent } from './components/rent/card-history/card-history.component';
import {MatMenuModule} from '@angular/material/menu';
import { CardRoomReceivedComponent } from './components/rent/card-room-received/card-room-received.component';
import { RentChangeRoomComponent } from './components/rent/rent-change-room/rent-change-room.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { RentCheckedOutComponent } from './components/rent/rent-check-out/rent-check-out.component';
import { RentHistoryUpdateComponent } from './components/rent/rent-history-update/rent-history-update.component';
import { RentMenuComponent } from './components/rent/rent-menu/rent-menu.component';
import {MatBadgeModule} from '@angular/material/badge';
import { RentUpdateComponent } from './components/rent/rent-update/rent-update.component';
import { FullNamePipe } from './pipes/full-name.pipe';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MenuBottomComponent } from './components/rent/menu-bottom/menu-bottom.component';
import { StaffComponent } from './components/manager/staff/staff.component';
import { CuPersonnelComponent } from './components/manager/cu-personnel/cu-personnel.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CuAccountComponent } from './components/manager/cu-account/cu-account.component';
import { AccountsComponent } from './components/manager/accounts/accounts.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReceiptsComponent } from './components/manager/receipts/receipts.component';
import { UpdateReceiptComponent } from './components/manager/update-receipt/update-receipt.component';
import { RentAddComponent } from './components/rent/rent-add/rent-add.component';
import {MatRadioModule} from '@angular/material/radio';
import { BookRoomComponent } from './components/book-room/book-room.component';
import { PersonComponent } from './components/book-room/person/person.component';
import { MatChipsModule } from '@angular/material/chips';



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
    FullNamePipe,
    CuCustomerComponent,
    CustomersComponent,
    RentComponent,
    CardHistoryComponent,
    CardRoomReceivedComponent,
    RentChangeRoomComponent,
    RentCheckedOutComponent,
    RentHistoryUpdateComponent,
    RentMenuComponent,
    RentUpdateComponent,
    MenuBottomComponent,
    StaffComponent,
    CuPersonnelComponent,
    CuAccountComponent,
    AccountsComponent,
    ReceiptsComponent,
    UpdateReceiptComponent,
    RentAddComponent,
    BookRoomComponent,
    PersonComponent,
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
    MatSelectModule,
    MatTabsModule,
    MatMenuModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatBadgeModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatBottomSheetModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatChipsModule,
    MatToolbarModule,
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: CustomMatPaginatorIntlService },
    { provide: TitleStrategy, useExisting: CustomTitleService },
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    MatSnackBar,
    CommonService,
    CurrencyPipe,
    MatDatepicker,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
