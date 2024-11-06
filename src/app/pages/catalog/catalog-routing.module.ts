import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogComponent } from './catalog.component';
import { DetailsComponent } from './details/details.component';
import { DetailsResolver } from 'src/app/resolver/details.resolver';

const routes: Routes = [
  {
    path: '',
    component: CatalogComponent,
  },
  {
    path: ':ty/:id',
    component: DetailsComponent,
    resolve: {
      data: DetailsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
