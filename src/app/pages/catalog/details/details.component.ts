import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FirebaseService } from 'src/app/core/firebase.service';
import { VariablesService } from 'src/app/core/variables.service';
import {
  ModelProduct,
  ModelPromo,
  ModelService,
} from 'src/app/interfaces/Global.interface';
import { FullImageComponent } from '../../basics/full-image/full-image.component';
import { MatDialog } from '@angular/material/dialog';
import { FullVideoComponent } from '../../basics/full-video/full-video.component';
import { AddCartComponent } from '../../basics/add-cart/add-cart.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  id = '';
  type = '';

  productList: ModelProduct[] = [];
  servicesList: ModelService[] = [];
  promosList: ModelPromo[] = [];

  mProduct: ModelProduct = structuredClone(this.variables.mProduct);
  mService: ModelService = structuredClone(this.variables.mService);
  mPromo: ModelPromo = structuredClone(this.variables.mPromo);

  mPSP: any;
  mediaSelected = '';
  mediaSelectedT = '';

  constructor(
    private readonly route: ActivatedRoute,
    public router: Router,
    public variables: VariablesService,
    public gFirebase: FirebaseService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    /** Get params url */
    this.route.params.subscribe(async (params: Params) => {
      this.type = params['ty'];
      this.id = params['id'];
    });

    /** Resolver Event */
    this.route.data.subscribe((data) => {
      this.mPSP = data['data'] as any;
      if (this.mPSP.images.length > 0) {
        this.mediaSelected = this.mPSP.images[0];
        this.mediaSelectedT = 'image';
      } else {
        this.mediaSelected = this.mPSP.videos[0];
        this.mediaSelectedT = 'video';
      }
    });
  }

  async checkDocLocal() {
    this.productList = [];
    this.servicesList = [];
    this.promosList = [];

    this.productList = await this.variables.getProducts();
    this.servicesList = await this.variables.getServices();
    this.promosList = await this.variables.getPromos();

    let p = this.productList.find((e) => {
      return e.sku === this.id;
    });
    if (p != undefined) {
      this.mProduct = p;
      this.mPSP = p;
    }

    let s = this.servicesList.find((e) => {
      return e.sku === this.id;
    });
    if (s != undefined) {
      this.mService = s;
      this.mPSP = s;
    }

    let pr = this.promosList.find((e) => {
      return e.sku === this.id;
    });
    if (pr != undefined) {
      this.mPromo = pr;
      this.mPromo = pr;
    }

    // if (this.productList.length == 0) {
    //   this.gFirebase.getProduct(this.id).then((e) => {
    //     if (e.name != '' && e.sku != '') {
    //       this.mProduct = e;
    // this.variables.setProductSnap(e)
    //     }
    //   });
    // }
    // if (this.servicesList.length == 0) {
    //   this.gFirebase.getServices().then((e) => {
    //     if (e.length > 0) this.servicesList = e;
    //   });
    // }
    // if (this.promosList.length == 0) {
    //   this.gFirebase.getPromos().then((e) => {
    //     if (e.length > 0) this.promosList = e;
    //   });
    // }
  }
  selectMedia(url: string, type: string) {
    if (url != '') {
      this.mediaSelected = url;
      this.mediaSelectedT = type;
    }
  }
  /** Load preview image **/
  imagePreview(e: string) {
    this.dialog.open(FullImageComponent, {
      width: 'calc(100vw -  2vh)',
      height: 'calc(100vh - 50px - 2vh)',
      minHeight: 'calc(100vh - 50px - 2vh)',
      position: { bottom: '1vh' },
      disableClose: false,
      data: {
        dataKey: e,
      },
    });
  }
  /** Load preview video **/
  videoPreview(e: string) {
    this.dialog.open(FullVideoComponent, {
      width: 'calc(100vw -  2vh)',
      height: 'calc(100vh - 50px - 2vh)',
      minHeight: 'calc(100vh - 50px - 2vh)',
      position: { bottom: '1vh' },
      disableClose: false,
      data: {
        dataKey: e,
      },
    });
  }
  goCatalog() {
    this.router.navigate(['catalog']);
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
