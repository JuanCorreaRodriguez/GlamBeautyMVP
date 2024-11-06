import { ActivatedRouteSnapshot } from '@angular/router';

import { FirebaseService } from 'src/app/core/firebase.service';
import { Injectable } from '@angular/core';
import {
  ModelProduct,
  ModelService,
  ModelPromo,
} from '../interfaces/Global.interface';
import { VariablesService } from '../core/variables.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DetailsResolver {
  model: any;
  id = '';
  type = '';
  mPSP: any;

  constructor(
    public variables: VariablesService,
    public gFirebase: FirebaseService
  ) {}

  async findProd() {
    let r: any;
    let list = await this.variables.getProducts();
    let p = list.find((e) => {
      return e.sku === this.id;
    });
    if (p != undefined) r = p;

    return r;
  }

  async findService() {
    let r: any;
    let list = await this.variables.getServices();
    let s = list.find((e) => {
      return e.sku === this.id;
    });
    if (s != undefined) r = s;
    return r;
  }

  async findPromo() {
    let r: any;
    let list = await this.variables.getPromos();

    let pr = list.find((e) => {
      return e.sku === this.id;
    });
    if (pr != undefined) r = pr;
    return r;
  }

  async resolve(
    route: ActivatedRouteSnapshot
  ): Promise<any | Promise<any> | Observable<any>> {
    this.type = route.paramMap.get('ty')!;
    this.id = route.paramMap.get('id')!;

    console.log(this.type);
    console.log(this.id);

    if (this.type != undefined && this.id != undefined) {
      // Getting products
      if (this.type == 'product') {
        return await this.findProd();
      }

      // Getting services
      if (this.type == 'service') {
        this.mPSP = await this.findService();
      }

      // Getting promos
      if (this.type == 'promo') {
        this.mPSP = await this.findPromo();
      }

      console.log('TORETURN', this.mPSP);
    }
    return this.mPSP;
  }
}
