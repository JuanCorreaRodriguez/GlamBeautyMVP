import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { FirebaseService } from 'src/app/core/firebase.service';
import { VariablesService } from 'src/app/core/variables.service';
import {
  ModelBussinesData,
  ModelCategory,
  ModelProduct,
} from 'src/app/interfaces/Global.interface';

@Component({
  selector: 'app-upsert-product',
  templateUrl: './upsert-product.component.html',
  styleUrls: ['./upsert-product.component.scss'],
})
export class UpsertProductComponent implements OnInit, OnDestroy {
  public formProduct: UntypedFormGroup = new UntypedFormGroup({});
  imgCat: any;
  imgFile: any;
  progressProfileImgMode: ProgressSpinnerMode = 'indeterminate';
  uploading = false;
  subcategoriesList: ModelCategory[] = [];
  subcategoreis: any[] = [];
  subcategoriesSEL: any[] = [];
  mBussines: ModelBussinesData = structuredClone(this.variables.mBusiness);
  mBrand: any[] = [];
  mCategory: any[] = [];

  loadingImages = false;
  previews: any[] = [];
  selectedFiles: any[] = [];

  loadingVideos = false;
  previewsVids: any[] = [];
  selectedFilesVids: any[] = [];

  imgToDelete: any[] = [];
  oImgToDelete: any[] = [];

  vidToDelete: any[] = [];
  vidToAdd: any[] = [];
  oVidToDelete: any[] = [];

  model: ModelProduct = this.variables.mProduct;
  action = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public variables: VariablesService,
    public gFirebase: FirebaseService
  ) {
    this.action = data.action;
    this.model = data.model;
    this.subcategoriesSEL = this.model.subcategories;
  }
  ngOnDestroy(): void {
    this.action = '';
    this.model = structuredClone(this.variables.mProduct);
    this.subcategoriesSEL = [];

    this.previews = [];
    this.selectedFiles = [];

    this.previewsVids = [];
    this.selectedFilesVids = [];

    this.imgToDelete = [];
    this.oImgToDelete = [];

    this.vidToDelete = [];
    this.vidToAdd = [];
    this.oVidToDelete = [];

    this.formProduct.reset();
  }

  async ngOnInit() {
    this.getLocalStorage();
    this.initProductForm();

    this.subcategoriesList = await this.variables.getCategories();
    this.getSbcategories();

    if (this.model.name != '' && this.action == 'update') {
      this.oImgToDelete = structuredClone(this.model.images);
      this.oVidToDelete = structuredClone(this.model.videos);
      this.fullDynamic();
    }
  }
  async getLocalStorage() {
    let b = await this.variables.getBusiness();
    let c = await this.variables.getCategories();
    if (b != undefined) {
      if (b.name != '') {
        this.mBussines = b;
        this.mBrand = b.brands;
      }
    }
    if (c != undefined) {
      this.mCategory = c;
    }
  }
  getSbcategories() {
    for (let s of this.subcategoriesList) {
      s.subcategories.forEach((element) => {
        const exists = this.subcategoreis.some((e) => {
          return e.subcategory == element.subcategory;
        });
        if (!exists) {
          this.subcategoreis.push(element);
        }
      });
    }
  }
  initProductForm() {
    this.formProduct = new UntypedFormGroup({
      name: new UntypedFormControl(this.model.name, Validators.required),
      desc: new UntypedFormControl(this.model.desc),
      brand: new UntypedFormControl(this.model.brand),
      category: new UntypedFormControl(this.model.category),
      discount: new UntypedFormControl(this.model.discount),
      price: new UntypedFormControl(this.model.price),
      stock: new UntypedFormControl(this.model.stock),
      ranking: new UntypedFormControl(this.model.ranking),
    });
  }
  updateSubcategoriesSel(item: any, checked: boolean) {
    const exists = this.subcategoriesSEL.some((r) => r == item);
    if (checked) {
      if (!exists) {
        this.subcategoriesSEL.push(item);
      }
    } else {
      if (exists) {
        this.subcategoriesSEL = this.subcategoriesSEL.filter((i) => i !== item);
      }
    }
  }
  checkIfChecked(event: any): boolean {
    return this.subcategoriesSEL.some(
      (e) => e.subcategory == event.subcategory
    );
  }
  /*Fill dynamic Form*/
  fullDynamic() {
    this.previews = this.model.images;
    this.previewsVids = this.model.videos;
  }
  /** Read image url */
  getImgUrl(i: number): string {
    return this.model.images[i];
  }
  /*************************************************** Update Video  **/

  /** Update Image Profile **/
  loadVideoProduct() {
    document.getElementById('vidUpdate')?.click();
  }
  /** Update card image **/
  async updateVideo(event: any) {
    // this.imgFile = event.target.files;
    this.selectedFilesVids = event.target.files;
    this.loadingVideos = true;

    if (this.selectedFilesVids && this.selectedFilesVids[0]) {
      // const numberOfFiles = this.selectedFilesVids.length;
      for (let i = 0; i < this.selectedFilesVids.length; i++) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.loadingVideos = false;
          this.previewsVids.push(e.target.result);
        };

        reader.readAsDataURL(this.selectedFilesVids[i]);
      }
    }
    this.model.videos = this.previewsVids;
  }
  removeVideo(i: any) {
    this.vidToDelete.push(this.oVidToDelete[i]);
    this.previewsVids.splice(i, 1);
  }
  /*************************************************** Update Image  **/
  loadImageProduct() {
    document.getElementById('imgProfileUpdate')?.click();
  }
  /** Update card image **/
  async updateCardImage(event: any) {
    this.imgFile = event.target.files;
    this.selectedFiles = event.target.files;
    this.loadingImages = true;

    if (this.selectedFiles && this.selectedFiles[0]) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.loadingImages = false;
          this.previews.push(e.target.result);
        };
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  }
  removeImage(i: any) {
    this.imgToDelete.push(this.oImgToDelete[i]);
    this.previews.splice(i, 1);
  }
  /****************************************************************** */
  /** Update Card General Data **/
  async createProduct(data: any, type: string) {
    /**
     * Check for new fields on 'Event' object:
     * add if no exists to prevent errors on template NPE
     * */
    if (data.value.name == undefined || data.value.name == '') {
      this.somethingWrong();
      return;
    }
    if (data.value.desc == undefined || data.value.desc == '') {
      this.somethingWrong();
      return;
    }
    if (data.value.brand == undefined || data.value.brand == '') {
      this.somethingWrong();
      return;
    }
    if (data.value.category == undefined || data.value.category == '') {
      this.somethingWrong();
      return;
    }
    if (data.value.price == undefined || data.value.price == '') {
      this.somethingWrong();
      return;
    }
    // if (data.value.discount == undefined || data.value.discount == '') {
    //   this.somethingWrong();
    //   return;
    // }
    if (data.value.stock == undefined || data.value.stock == '') {
      this.somethingWrong();
      return;
    }
    if (this.subcategoriesSEL.length > 0) {
      this.model.subcategories = this.subcategoriesSEL;
    }

    this.model.name = data.value.name.trim();
    this.model.desc = data.value.desc.trim();
    this.model.brand = data.value.brand.trim();
    this.model.price = data.value.price;
    this.model.discount = data.value.discount;
    this.model.category = data.value.category.trim();
    this.model.stock = data.value.stock;
    this.model.dateTime = Date.now();

    if (type == 'create') {
      this.model.sku = await this.variables.createCode(4);
      this.createEvent(type);
    } else if (type == 'update') {
      this.updateEvent(type);
    }
  }
  somethingWrong() {
    this.variables.launchSnackBar('Algunos campos estan vacios...', '', 5000);
  }
  /** Update Event check first if event has completed */
  async createEvent(action: string) {
    this.uploading = true;

    this.gFirebase
      .createDBDoc<ModelProduct>(
        this.model,
        action,
        this.selectedFiles,
        this.selectedFilesVids,
        'products'
      )
      .then(() => {
        this.variables.launchSnackBar('Producto creado', '', 3000);
        this.uploading = false;
      });
  }
  /** Update Event check first if event has completed */
  async updateEvent(action: string) {
    this.uploading = true;
    // for (let i of this.imgToDelete) {
    //   this.extractFileNameFromUrl(i);
    // }

    this.gFirebase
      .updateDBDoc<ModelProduct>(
        this.model,
        action,
        this.selectedFiles,
        this.selectedFilesVids,
        this.imgToDelete,
        this.vidToDelete,
        'products'
      )
      .then(() => {
        this.variables.launchSnackBar('Producto actualizado', '', 3000);
        this.uploading = false;
      });
  }
  extractFileNameFromUrl(url: string): string | null {
    const urlParts = url.split('/');
    const fileNameWithQueryParams = urlParts[urlParts.length - 1];
    const fileNameParts = fileNameWithQueryParams.split('?')[0];
    const fileName = decodeURIComponent(fileNameParts);
    console.log('CHILD', fileName);
    return fileName;
  }
}

('https://firebasestorage.googleapis.com/v0/b/glambeauty-c39c3.appspot.com/o/products%2FAcr%C3%ADlico%20transparente%20%2FAcr%C3%ADlico%20transparente%200.png?alt=media&token=236913a5-4fe5-4471-b308-4509132d2371');
('https://firebasestorage.googleapis.com/v0/b/glambeauty-c39c3.appspot.com/o/products%2FAcr%C3%ADlico%20transparente%20%2FAcr%C3%ADlico%20transparente%200.png?alt=media&token=236913a5-4fe5-4471-b308-4509132d2371');
