import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  AfterViewInit,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/core/firebase.service';
import { GlobalObservablesService } from 'src/app/core/global-observables.service';
import { VariablesService } from 'src/app/core/variables.service';
import {
  ModelCategory,
  ModelProduct,
  ModelPromo,
  ModelService,
} from 'src/app/interfaces/Global.interface';
import { SwiperOptions } from 'swiper';
import Swiper, { Autoplay } from 'swiper';
import { AddCartComponent } from '../basics/add-cart/add-cart.component';
Swiper.use([Autoplay]);

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit, AfterViewInit {
  public formSearch: UntypedFormGroup = new UntypedFormGroup({});
  searchTerm = '';
  filterdProd = false;
  filterdServ = false;
  filterdProm = false;

  filteredProdList: ModelProduct[] = [];
  filteredServList: ModelService[] = [];
  filteredPromList: ModelPromo[] = [];

  productList: ModelProduct[] = [];
  productListLatest: ModelProduct[] = [];
  servicesList: ModelService[] = [];
  promosList: ModelPromo[] = [];

  mProduct: ModelProduct = structuredClone(this.variables.mProduct);
  vStyle = 'card';

  mCategories: ModelCategory[] = [];

  swiperEffect: SwiperOptions['effect'] = 'flip';
  resizeImage = false;
  config: SwiperOptions = {
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 100,
      disableOnInteraction: false,
    },
    slidesPerView: 'auto',
    speed: 2500,
    keyboard: true,
    grabCursor: true,
  };
  configServices: SwiperOptions = {
    loop: false,
    slidesPerView: 2,
    speed: 100,
    keyboard: true,
    grabCursor: true,
  };
  configPromos: SwiperOptions = {
    loop: false,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: 'auto',
    speed: 2000,
  };

  constructor(
    public variables: VariablesService,
    public gFirebase: FirebaseService,
    public dialog: MatDialog,
    public gObservables: GlobalObservablesService,
    private changeDetector: ChangeDetectorRef,
    public router: Router
  ) {}
  ngAfterViewInit(): void {}
  async ngOnInit() {
    this.gFirebase.subscribeSnapUpdates('products');
    this.gFirebase.subscribeSnapUpdates('services');
    this.gFirebase.subscribeSnapUpdates('promos');
    this.gFirebase.subscribeCatUpdates();
    this.initSearchForm();
    this.gObservables.getProd.subscribe((e) => {
      if (e == 'create' || e == 'delete' || e == 'update') {
        this.dialog.closeAll();
      }
      if (e == 'delete') {
        this.variables.launchSnackBar('Producto eliminada', '', 3000);
      }
      if (e == 'create') {
        this.variables.launchSnackBar('Producto creado', '', 3000);
      }
      if (e != '') this.checkProductLocal();
    });
    this.gObservables.getCat.subscribe((e) => {
      if (e != '') this.checkCategoriesLocal();
    });

    this.vStyle = await this.variables.getSetting('gl_vs');
    this.checkProductLocal();
    this.checkCategoriesLocal();

    new Swiper('.swiper', this.config);
    new Swiper('.swiperPromos', this.configPromos);
    this.changeDetector.detectChanges();
  }
  async resizeSwiperCat() {
    let s = document.getElementById('swiper');
    this.swiperEffect = 'slide';
    if (
      this.swiperEffect == 'flip' ||
      this.swiperEffect == 'cube' ||
      this.swiperEffect == 'fade'
    ) {
      s?.classList.add('imgResized');
      this.resizeImage = true;
    } else {
      s?.classList.remove('imgResized');
      this.resizeImage = false;
    }
    this.changeDetector.detectChanges();
  }
  async checkCategoriesLocal() {
    this.mCategories = await this.variables.getCategories();
    if (this.mCategories == undefined) {
      this.gFirebase.subscribeCatUpdates();
    }
  }
  async checkProductLocal() {
    this.productList = [];
    this.servicesList = [];
    this.promosList = [];

    this.productList = await this.variables.getProducts();
    this.servicesList = await this.variables.getServices();
    this.promosList = await this.variables.getPromos();

    // Getting latest products
    this.productListLatest = this.getNearestProducts(this.productList, 10);
    // console.log('LATEST', this.productListLatest);

    this.filteredProdList = this.productList;

    if (this.productList.length == 0) {
      this.gFirebase.getProducts().then((e) => {
        if (e.length > 0) {
          this.productList = e;
          this.filteredProdList = e;
        }
      });
    }
    if (this.servicesList.length == 0) {
      this.gFirebase.getServices().then((e) => {
        if (e.length > 0) this.servicesList = e;
      });
    }
    if (this.promosList.length == 0) {
      this.gFirebase.getPromos().then((e) => {
        if (e.length > 0) this.promosList = e;
      });
    }
    this.changeDetector.detectChanges();
  }
  /** Init general form */
  initSearchForm() {
    this.formSearch = new UntypedFormGroup({
      keyword: new UntypedFormControl(''),
    });
  }
  filterEntries() {
    this.filteredProdList = this.productList.filter(
      (entry) =>
        entry.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.desc.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    if (this.searchTerm.length == 0) this.filterdProd = false;
    else this.filterdProd = true;

    this.filteredServList = this.servicesList.filter(
      (entry) =>
        entry.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.desc.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    if (this.searchTerm.length == 0) this.filterdServ = false;
    else this.filterdServ = true;

    this.filteredPromList = this.promosList.filter(
      (entry) =>
        entry.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.desc.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    if (this.searchTerm.length == 0) this.filterdProm = false;
    else this.filterdProm = true;
  }
  checkImage(i: number, source: string): string {
    let url = '';
    if (source == 'products') {
      url =
        this.productList[i].images[0] == ''
          ? '../../../../assets/img/glam_logo.webp'
          : this.productList[i].images[0];
    }
    if (source == 'services') {
      url =
        this.servicesList[i].images[0] == ''
          ? '../../../../assets/img/glam_logo.webp'
          : this.servicesList[i].images[0];
    }
    return url;
  }
  checkCatImage(m: ModelCategory): string {
    let url = m.image == '' ? '../../../../assets/img/glam_logo.webp' : m.image;
    return url;
  }
  getTanking<T extends ModelProduct | ModelService>(model: T): number {
    let sum = 0;
    let r = 0;
    model.ranking.rank.forEach((e) => {
      sum = sum + e;
    });
    // console.log('SUM', sum);
    // console.log('SUM', model.ranking);
    if (sum > 0) {
      r = sum / model.ranking.votes;
    }
    return r;
  }
  /** Get latest products */
  getNearestProducts(products: ModelProduct[], n: number): ModelProduct[] {
    // Ordenar el array de productos por la diferencia absoluta entre la fecha actual y dateTime en orden ascendente
    const sortedProducts = products.sort(
      (a, b) =>
        Math.abs(new Date().getTime() - a.dateTime) -
        Math.abs(new Date().getTime() - b.dateTime)
    );

    // Tomar los primeros "n" elementos del array ordenado
    const nearestProducts = sortedProducts.slice(0, n);

    return nearestProducts as ModelProduct[];
  }
  // dynamiMask(): string {
  //   console.log(
  //     'MASKRANDOM',
  //     this.variables.masks[
  //       Math.floor(Math.random() * this.variables.masks.length)
  //     ]
  //   );
  //   return 'a';
  // }
  /** View Product details */
  viewDetails<T extends ModelProduct | ModelService>(model: T) {}
  /** Add to cart */
  details(type: string, id: string) {
    this.router.navigate(['catalog/' + type + '/' + id]);
  }
  addToCart(m: ModelProduct) {
    const w = this.variables.geDialogWidth3596();
    this.dialog
      .open(AddCartComponent, {
        maxWidth: w,
        minWidth: w,
        width: w,
        disableClose: false,
        data: {
          model: m,
        },
      })
      .afterClosed()
      .subscribe((o) => {});
  }
}
