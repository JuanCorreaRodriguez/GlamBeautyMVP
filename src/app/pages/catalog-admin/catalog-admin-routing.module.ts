import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogAdminComponent } from './catalog-admin.component';
import { ProductComponent } from './product/product.component';
import { ServiceComponent } from './cServices/service.component';
import { CategoryComponent } from './category/category.component';
import { GlamComponent } from './glam/glam.component';
import { PromosComponent } from './promos/promos.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogAdminComponent,
    children: [
      {
        path: '',
        component: ProductComponent,
      },
      {
        path: 'products',
        component: ProductComponent,
      },
      {
        path: 'services',
        component: ServiceComponent,
      },
      {
        path: 'categories',
        component: CategoryComponent,
      },
      {
        path: 'admin',
        component: GlamComponent,
      },
      {
        path: 'promos',
        component: PromosComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogAdminRoutingModule {}
