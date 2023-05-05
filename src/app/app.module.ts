import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { AppRoutesModule } from './routes/app-routes.module';

import { AppComponent } from './app.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ManagerComponent } from './components/manager/manager.component';
import { ManagerItemComponent } from './components/manager/manager-item/manager-item.component';
import { MatCardModule } from '@angular/material/card';
import { TwoColsLayoutComponent } from './layouts/two-cols-layout/two-cols-layout.component';
import { ThreeColsLayoutComponent } from './layouts/three-cols-layout/three-cols-layout.component';
import { RoomTypeComponent } from './components/manager/room-type/room-type.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomMatPaginatorIntlService } from './services/custom-mat-paginator-intl.service';
import { DialogComponent } from './components/dialog/dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    InventoryComponent,
    ManagerComponent,
    ManagerItemComponent,
    TwoColsLayoutComponent,
    ThreeColsLayoutComponent,
    RoomTypeComponent,
    DialogComponent
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
    MatDialogModule
  ],
  providers: [{
    provide: MatPaginatorIntl,
    useClass: CustomMatPaginatorIntlService
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
