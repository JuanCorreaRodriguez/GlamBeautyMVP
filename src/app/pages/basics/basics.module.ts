import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from './main-toolbar/main-toolbar.component';
import { MaterialModule } from '../material/material.module';
import { DialogsComponent } from './dialogs/dialogs.component';
import { EllipsisPipe } from 'src/app/pipes/ellipsis.pipe';
import { FullImageComponent } from './full-image/full-image.component';
import { FullVideoComponent } from './full-video/full-video.component';
import { AddCartComponent } from './add-cart/add-cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';

@NgModule({
  declarations: [
    MainToolbarComponent,
    DialogsComponent,
    EllipsisPipe,
    FullImageComponent,
    FullVideoComponent,
    AddCartComponent,
  ],
  exports: [MainToolbarComponent, DialogsComponent, EllipsisPipe],
  imports: [
    MaterialModule,
    MatDialogModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
  ],
})
export class BasicsModule {}
