import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import {
  ModelBrand,
  ModelBussinesData,
  ModelCart,
  ModelCategory,
  ModelProduct,
  ModelPromo,
  ModelRanking,
  ModelScheduleDay,
  ModelService,
} from '../interfaces/Global.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';
import { GlobalObservablesService } from './global-observables.service';

@Injectable({
  providedIn: 'root',
})
export class VariablesService {
  webUrl = 'https://glambeauty-c39c3.web.app/';
  catalogUrl = 'https://glambeauty-c39c3.web.app/catalog/product/';
  serviceUrl = 'https://glambeauty-c39c3.web.app/catalog/service/';
  promosUrl = 'https://glambeauty-c39c3.web.app/catalog/promos/';
  mScheduleDay: ModelScheduleDay = {
    close: '',
    day: '',
    open: '',
  };
  mBrand: ModelBrand = {
    name: '',
  };
  mBusiness: ModelBussinesData = {
    address: [],
    brands: [],
    name: '',
    desc: '',
    phones: [],
    schedules: [],
    sTyps: [],
  };
  mCategory: ModelCategory = {
    desc: '',
    id: '',
    image: '',
    name: '',
    subcategories: [],
  };
  mRanking: ModelRanking = {
    rank: [5],
    votes: 1,
  };
  mProduct: ModelProduct = {
    brand: '',
    category: '',
    desc: '',
    discount: 0,
    images: [],
    name: '',
    price: 0,
    ranking: this.mRanking,
    sku: '',
    stock: 0,
    videos: [],
    subcategories: [],
    dateTime: 0,
    promo: '',
  };
  mService: ModelService = {
    images: [],
    videos: [],
    type: '',
    dateTime: 0,
    desc: '',
    name: '',
    price: 0,
    promo: '',
    sku: '',
    duration: '',
    author: '',
    subcategories: [],
    ranking: this.mRanking,
  };
  mPromo: ModelPromo = {
    images: [],
    videos: [],
    discount: 0,
    max: 0,
    count: 0,
    dateTime: 0,
    desc: '',
    from: 0,
    sku: '',
    name: '',
    to: 0,
    type: '',
  };
  mCart: ModelCart = {
    amount: 0,
    product: this.mProduct,
  };
  mPromoTypes = ['Porcentaje (%)', 'Moneda ($)'];

  mOpinions = [
    {
      name: 'Arleth Pérez',
      resume:
        'Super recomendable un excelente servicio en los cursos 🫶🏻 y una super calidad en el material',
      date: '6 Septiembre',
    },
    {
      name: 'Andy み',
      resume: 'Excelente servicio, me gustó!✨',
      date: '18 Enero',
    },
    {
      name: 'Lily RM',
      resume:
        'Recomendadisima, maneja buenos precios y cursos muy completos y personalizados 10/10✨️',
      date: '30 Mayo',
    },
    {
      name: 'Maria Zamora',
      resume: 'Encantada con mis uñas💞💅 \nExelente servicio y muy amable',
      date: '27 Noviembre',
    },
    {
      name: 'Valeria Cazares',
      resume: 'Recomendado material genial 😊',
      date: '6 Febrero',
    },
    {
      name: 'Maricela Martinesz',
      resume: 'Exelente servicio me encantó',
      date: '8 Febrero',
    },
    {
      name: 'Paola Fragoso López',
      resume:
        'Muy recomendable cuenta con material de primera calidad super amable se las recomiendo al 100% me cantaron mis uñitas gracias nena',
      date: '5 Diciembre',
    },
  ];
  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    public _snackBar: MatSnackBar,
    private gObs: GlobalObservablesService
  ) {}

  /** Create code **/
  async createCode(lenght: number) {
    let code = '';
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLenght = characters.length;
    for (let i = 0; i < lenght; i++) {
      code += characters.charAt(Math.floor(Math.random() * charactersLenght));
    }
    return code;
  }
  /************************************************************** Get local storage category */
  async setCategories(model: ModelCategory[]) {
    if (isPlatformBrowser(this._platformId)) {
      if (model != null) {
        localStorage.removeItem('gl_ct');
        localStorage.setItem('gl_ct', JSON.stringify(model));
      }
    }
  }

  async setCatSnap(model: ModelCategory[]) {
    let l = await this.getCategories();
    for (let m of model) {
      const exists = l.some((r) => r.id == m.id);
      if (exists) {
        l = l.filter((i) => i.id !== m.id);
      }
      l.push(m);
      if (isPlatformBrowser(this._platformId)) {
        if (model != null) {
          localStorage.removeItem('gl_ct');
          localStorage.setItem('gl_ct', JSON.stringify(l));
        }
      }
    }
  }
  async updateCategories(model: ModelCategory) {
    let l = await this.getCategories();

    let i = l.findIndex((e) => {
      return e.id == model.id;
    });
    if (i != undefined) {
      if (i > 0) {
        l.splice(i, 1);
        l.push(model);
      }
    } else {
      l.push(model);
    }

    if (isPlatformBrowser(this._platformId)) {
      if (model != null) {
        localStorage.removeItem('gl_ct');
        localStorage.setItem('gl_ct', JSON.stringify(l));
      }
    }
  }
  async removeCategories(model: ModelCategory) {
    let l = await this.getCategories();
    // Find the index of object to delete
    const indexOfObject = l.findIndex((o) => {
      return o.id === model.id;
    });
    if (indexOfObject != undefined) {
      l.splice(indexOfObject, 1);

      if (isPlatformBrowser(this._platformId)) {
        if (model != null) {
          localStorage.removeItem('gl_ct');
          localStorage.setItem('gl_ct', JSON.stringify(l));
        }
      }
    }
  }
  async getCategories() {
    let m: ModelCategory[] = [];
    if (isPlatformBrowser(this._platformId)) {
      let l = localStorage.getItem('gl_ct');
      if (l != undefined) {
        m = JSON.parse(l) as ModelCategory[];
      }
    }
    return m;
  }
  /************************************************************** Get local storage services */
  async setServices(model: ModelService[]) {
    if (isPlatformBrowser(this._platformId)) {
      if (model != null) {
        localStorage.removeItem('gl_sr_all');
        localStorage.setItem('gl_sr_all', JSON.stringify(model));
      }
    }
  }
  async getServices() {
    let m: ModelService[] = [];
    if (isPlatformBrowser(this._platformId)) {
      let l = localStorage.getItem('gl_sr_all');
      if (l != undefined) {
        m = JSON.parse(l) as ModelService[];
      }
    }
    return m;
  }
  async removeService(model: ModelService) {
    let l = await this.getCategories();
    // Find the index of object to delete
    const indexOfObject = l.findIndex((o) => {
      return o.id === model.sku;
    });
    if (indexOfObject != undefined) {
      l.splice(indexOfObject, 1);

      if (isPlatformBrowser(this._platformId)) {
        if (model != null) {
          localStorage.removeItem('gl_sr_all');
          localStorage.setItem('gl_sr_all', JSON.stringify(l));
        }
      }
    }
  }
  /************************************************************** Get local storage promos */
  async setPromos(model: ModelPromo[]) {
    if (isPlatformBrowser(this._platformId)) {
      if (model != null) {
        localStorage.removeItem('gl_pr_all');
        localStorage.setItem('gl_pr_all', JSON.stringify(model));
      }
    }
  }
  async getPromos() {
    let m: ModelPromo[] = [];
    if (isPlatformBrowser(this._platformId)) {
      let l = localStorage.getItem('gl_pr_all');
      if (l != undefined) {
        m = JSON.parse(l) as ModelPromo[];
      }
    }
    return m;
  }
  async setSnapUpdate<T extends ModelProduct | ModelService | ModelPromo>(
    model: T,
    source: string
  ) {
    let l: any[] = [];
    let key = '';
    if (source == 'products') {
      l = await this.getProducts();
      key = 'gl_pt_all';
    }
    if (source == 'services') {
      l = await this.getServices();
      key = 'gl_sr_all';
    }
    if (source == 'promos') {
      l = await this.getPromos();
      key = 'gl_pr_all';
    }

    if (l.length > 0) {
      l.push(model);

      const exists = l.some((r: T) => r.sku == model.sku);
      if (exists) {
        l = l.filter((i: T) => i.sku !== model.sku);
      }
      l.push(model);
      if (isPlatformBrowser(this._platformId)) {
        if (model != null) {
          localStorage.removeItem(key);
          localStorage.setItem(key, JSON.stringify(l));
        }
      }
    }
  }
  /********************************************************** setGet detailed product - service - promo */
  async setDoc<T extends ModelProduct | ModelService | ModelPromo>(
    key: string,
    model: T
  ) {
    if (isPlatformBrowser(this._platformId)) {
      if (model != null) {
        localStorage.removeItem(key);
        localStorage.setItem(key, JSON.stringify(model));
      }
    }
  }
  async getDoc(key: string) {
    let res: any = null;
    if (isPlatformBrowser(this._platformId)) {
      let model = localStorage.getItem(key);
      if (model != null) res = model;
    }
    return res;
  }
  /************************************************************** Get local storage product */
  async setProducts(model: ModelProduct[]) {
    if (isPlatformBrowser(this._platformId)) {
      if (model != null) {
        localStorage.removeItem('gl_pt_all');
        localStorage.setItem('gl_pt_all', JSON.stringify(model));
      }
    }
  }
  async setProductSnap(model: ModelProduct) {
    let l = await this.getProducts();
    l.push(model);

    const exists = l.some((r) => r.sku == model.sku);
    if (exists) {
      l = l.filter((i) => i.sku !== model.sku);
    }
    l.push(model);
    if (isPlatformBrowser(this._platformId)) {
      if (model != null) {
        localStorage.removeItem('gl_pt_all');
        localStorage.setItem('gl_pt_all', JSON.stringify(l));
      }
    }
  }
  async getProducts() {
    let m: ModelProduct[] = [];
    if (isPlatformBrowser(this._platformId)) {
      let l = localStorage.getItem('gl_pt_all');
      if (l != undefined) {
        m = JSON.parse(l) as ModelProduct[];
      }
    }
    return m;
  }
  async getProduct(sku: string) {
    let p: ModelProduct = this.mProduct;
    if (isPlatformBrowser(this._platformId)) {
      let l = localStorage.getItem('gl_pt_' + sku);
      if (l != undefined) {
        p = JSON.parse(l) as ModelProduct;
      }
    }
    return p;
  }
  async updateLocalDoc<T extends ModelProduct | ModelService | ModelPromo>(
    model: T,
    type: string
  ) {
    let l: any = null;
    if (type == 'products') l = await this.getProducts();
    if (type == 'services') l = await this.getServices();
    if (type == 'promos') l = await this.getPromos();
    l.push(model);
    if (isPlatformBrowser(this._platformId)) {
      if (model != null) {
        // localStorage.removeItem('gl_pt_all');
        // localStorage.setItem('gl_pt_all', JSON.stringify(l));
        if (type == 'products') {
          localStorage.removeItem('gl_pt_all');
          localStorage.setItem('gl_pt_all', JSON.stringify(l));
        }
        if (type == 'services') {
          localStorage.removeItem('gl_sr_all');
          localStorage.setItem('gl_sr_all', JSON.stringify(l));
        }
        if (type == 'promos') {
          localStorage.removeItem('gl_pr_all');
          localStorage.setItem('gl_pr_all', JSON.stringify(l));
        }
      }
    }
  }
  async removeLocalDB<T extends ModelProduct | ModelService | ModelPromo>(
    model: T,
    type: string
  ) {
    let l: any = null;
    if (type == 'products') l = await this.getProducts();
    if (type == 'services') l = await this.getServices();
    if (type == 'promos') l = await this.getPromos();

    if (l != null) {
      // Find the index of object to delete
      const indexOfObject = l.findIndex((o: T) => {
        return o.sku === model.sku;
      });
      if (indexOfObject != undefined) {
        l.splice(indexOfObject, 1);

        if (isPlatformBrowser(this._platformId)) {
          if (model != null) {
            if (type == 'products') {
              localStorage.removeItem('gl_pt_all');
              localStorage.setItem('gl_pt_all', JSON.stringify(l));
            }
            if (type == 'services') {
              localStorage.removeItem('gl_sr_all');
              localStorage.setItem('gl_sr_all', JSON.stringify(l));
            }
            if (type == 'promos') {
              localStorage.removeItem('gl_pr_all');
              localStorage.setItem('gl_pr_all', JSON.stringify(l));
            }
          }
        }
      }
    }
  }
  /** Get local storage quiz responses array*/
  async getProductToEdit() {
    let product: ModelProduct = this.mProduct;
    if (isPlatformBrowser(this._platformId)) {
      /** Check if guest storage exists */
      if (
        localStorage.getItem('gl_pr_ed') != undefined ||
        localStorage.getItem('gl_pr_ed') != null
      ) {
        product = (await JSON.parse(
          localStorage.getItem('gl_pr_ed')!
        )) as ModelProduct;
        return product;
      }
    }
    return product;
  }
  setProductToEdit(model: ModelProduct) {
    if (isPlatformBrowser(this._platformId)) {
      if (model != null) {
        localStorage.removeItem('gl_pr_ed');
        localStorage.setItem('gl_pr_ed', JSON.stringify(model));
        // this.globalService.setNotificationAdded = true;
      }
    }
  }
  /**************************************************************************************** */
  /******************************************************************************* BUSINESS */
  async setBusiness(model: ModelBussinesData) {
    if (isPlatformBrowser(this._platformId)) {
      if (model != null) {
        localStorage.removeItem('gl_bns');
        localStorage.setItem('gl_bns', JSON.stringify(model));
      }
    }
  }
  async getBusiness() {
    let m = this.mBusiness;
    if (isPlatformBrowser(this._platformId)) {
      let l = localStorage.getItem('gl_bns');
      if (l != undefined) {
        m = JSON.parse(l) as ModelBussinesData;
      }
    }
    return m;
  }
  /**************************************************************************************** */
  /******************************************************************************* Settings */
  async getSetting(key: string) {
    let m: string = '';
    if (isPlatformBrowser(this._platformId)) {
      let l = localStorage.getItem(key);
      if (l != undefined) {
        m = l;
      }
    }
    return m;
  }
  async setSetting(value: string, key: string) {
    if (isPlatformBrowser(this._platformId)) {
      if (value != null) {
        localStorage.removeItem(key);
        localStorage.setItem(key, value);
      }
    }
  }

  /**************************************************************************************** */
  /********************************************************************************* BRANDS */
  async getBrands() {
    let m: ModelBrand[] = [];
    if (isPlatformBrowser(this._platformId)) {
      let l = localStorage.getItem('gl_br_all');
      if (l != undefined) {
        m = JSON.parse(l) as ModelBrand[];
      }
    }
    return m;
  }
  async setBrand(model: ModelBrand[]) {
    if (isPlatformBrowser(this._platformId)) {
      if (model != null) {
        localStorage.removeItem('gl_br_all');
        localStorage.setItem('gl_br_all', JSON.stringify(model));
      }
    }
  }
  /**************************************************************************************** */
  geDialogWidth6596() {
    let w = '96%';
    window.innerWidth > 767 ? (w = '65%') : '96%';
    return w;
  }
  geDialogWidth3596() {
    let w = '96%';
    window.innerWidth > 767 ? (w = '35%') : '96%';
    return w;
  }
  geDialogWidth4596() {
    let w = '90%';
    window.innerWidth > 767 ? (w = '45%') : '96%';
    return w;
  }
  geDialogWidth8096() {
    let w = '90%';
    window.innerWidth > 767 ? (w = '80%') : '96%';
    return w;
  }
  geDialogWidth9096() {
    let w = '96%';
    window.innerWidth > 767 ? (w = '90%') : '96%';
    return w;
  }
  geDialogWidth8098() {
    let w = '98%';
    window.innerWidth > 767 ? (w = '80%') : '98%';
    return w;
  } /********************************************************** CART */
  async addCart(amount: number, model: ModelProduct) {
    if (isPlatformBrowser(this._platformId)) {
      if (model != null) {
        let actualCart = await this.getCart();
        let mCart: ModelCart = {
          amount: amount,
          product: model,
        };
        actualCart.push(mCart);

        localStorage.removeItem('gl_cart');
        localStorage.setItem('gl_cart', JSON.stringify(actualCart));
      }
    }
  }
  async getCart() {
    let res: ModelCart[] = [];
    if (isPlatformBrowser(this._platformId)) {
      let model = localStorage.getItem('gl_cart');
      if (model != null) res = JSON.parse(model) as ModelCart[];
    }
    return res;
  }
  /** Snackbars */
  launchSnackBar(message: string, action: string, duration: number) {
    this._snackBar.open(message, action, {
      duration: duration,
    });
  }
  launchSnackBarWithAction(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
