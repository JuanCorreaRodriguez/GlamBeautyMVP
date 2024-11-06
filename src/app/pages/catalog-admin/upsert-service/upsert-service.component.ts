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
  ModelService,
} from 'src/app/interfaces/Global.interface';

@Component({
  selector: 'app-upsert-service',
  templateUrl: './upsert-service.component.html',
  styleUrls: ['./upsert-service.component.scss'],
})
export class UpsertServiceComponent implements OnInit, OnDestroy {
  public formService: UntypedFormGroup = new UntypedFormGroup({});
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
  mTyps: any[] = [];

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

  mService: ModelService = this.variables.mService;
  action = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public variables: VariablesService,
    public gFirebase: FirebaseService
  ) {
    this.action = data.action;
    this.mService = data.model;
    this.subcategoriesSEL = this.mService.subcategories;
  }
  ngOnDestroy(): void {
    this.action = '';
    this.mService = structuredClone(this.variables.mService);
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

    this.formService.reset();
  }

  async ngOnInit() {
    this.getLocalStorage();
    this.initServiceForm();

    this.subcategoriesList = await this.variables.getCategories();
    this.getSbcategories();

    if (this.mService.name != '' && this.action == 'update') {
      this.oImgToDelete = structuredClone(this.mService.images);
      this.oVidToDelete = structuredClone(this.mService.videos);
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
        this.mTyps = b.sTyps;
      }
    }
    if (c != undefined) {
      this.mCategory = c;
    }
  }
  getSbcategories() {
    for (let s of this.subcategoriesList) {
      s.subcategories.forEach((element) => {
        this.subcategoreis.push(element);
      });
    }
  }
  initServiceForm() {
    this.formService = new UntypedFormGroup({
      name: new UntypedFormControl(this.mService.name, Validators.required),
      author: new UntypedFormControl(this.mService.author, Validators.required),
      desc: new UntypedFormControl(this.mService.desc),
      duration: new UntypedFormControl(this.mService.duration),
      type: new UntypedFormControl(this.mService.type),
      price: new UntypedFormControl(this.mService.price),
      ranking: new UntypedFormControl(this.mService.ranking),
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
    return this.subcategoriesSEL.some((e) => e == event);
  }
  /*Fill dynamic Form*/
  fullDynamic() {
    this.previews = this.mService.images;
    this.previewsVids = this.mService.videos;
  }
  /** Read image url */
  getImgUrl(i: number): string {
    return this.mService.images[i];
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
    this.mService.videos = this.previewsVids;
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
  async createService(data: any, type: string) {
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
    if (data.value.author == undefined || data.value.author == '') {
      this.somethingWrong();
      return;
    }
    if (data.value.duration == undefined || data.value.duration == '') {
      this.somethingWrong();
      return;
    }
    if (data.value.type == undefined || data.value.type == '') {
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
    if (this.subcategoriesSEL.length > 0) {
      this.mService.subcategories = this.subcategoriesSEL;
    }

    this.mService.name = data.value.name;
    this.mService.desc = data.value.desc;
    this.mService.author = data.value.author;
    this.mService.duration = data.value.duration;
    this.mService.price = data.value.price;
    this.mService.type = data.value.type;
    this.mService.dateTime = Date.now();

    if (type == 'create') {
      this.mService.sku = await this.variables.createCode(4);
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
      .createDBDoc<ModelService>(
        this.mService,
        action,
        this.selectedFiles,
        this.selectedFilesVids,
        'services'
      )
      .then(() => {
        this.variables.launchSnackBar('Servicio creado', '', 3000);
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
      .updateDBDoc<ModelService>(
        this.mService,
        action,
        this.selectedFiles,
        this.selectedFilesVids,
        this.imgToDelete,
        this.vidToDelete,
        'services'
      )
      .then(() => {
        this.variables.launchSnackBar('Servicio actualizado', '', 3000);
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
