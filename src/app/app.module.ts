import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BasicsModule } from './pages/basics/basics.module';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatDateFnsModule } from '@angular/material-date-fns-adapter';
import { es } from 'date-fns/locale';
import { MAT_DATE_LOCALE } from '@angular/material/core';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BasicsModule,
    MatDateFnsModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
  ],
  declarations: [AppComponent],
  providers: [
    {
      provide: MAT_DATE_LOCALE,
      useValue: es,
    },
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
