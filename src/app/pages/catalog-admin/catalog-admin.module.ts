import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogAdminRoutingModule } from './catalog-admin-routing.module';
import { CatalogAdminComponent } from './catalog-admin.component';
import { MaterialModule } from '../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from './product/product.component';
import { CategoryComponent } from './category/category.component';
import { ServiceComponent } from './cServices/service.component';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
} from '@angular/material/snack-bar';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';
import { UpsertCategoryComponent } from './upsert-category/upsert-category.component';
import { UpsertProductComponent } from './upsert-product/upsert-product.component';
import { GlamComponent } from './glam/glam.component';
import { InfoComponent } from './info/info.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { BasicsModule } from '../basics/basics.module';
import { UpsertServiceComponent } from './upsert-service/upsert-service.component';
import { PromosComponent } from './promos/promos.component';
import { UpsertromosComponent } from './upsertromos/upsertromos.component';

@NgModule({
  declarations: [
    CatalogAdminComponent,
    ProductComponent,
    CategoryComponent,
    UpsertCategoryComponent,
    UpsertProductComponent,
    ServiceComponent,
    GlamComponent,
    InfoComponent,
    UpsertServiceComponent,
    PromosComponent,
    UpsertromosComponent,
  ],
  imports: [
    CommonModule,
    NgxMatTimepickerModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    MatDialogModule,
    MatSnackBarModule,
    CatalogAdminRoutingModule,
    BasicsModule,
  ],
  providers: [
    { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
})
export class CatalogAdminModule {}
