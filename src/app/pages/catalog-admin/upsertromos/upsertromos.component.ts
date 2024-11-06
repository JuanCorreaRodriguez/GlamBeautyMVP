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
  ModelPromo,
} from 'src/app/interfaces/Global.interface';

@Component({
  selector: 'app-upsertromos',
  templateUrl: './upsertromos.component.html',
  styleUrls: ['./upsertromos.component.scss'],
})
export class UpsertromosComponent implements OnInit, OnDestroy {
  public formPromo: UntypedFormGroup = new UntypedFormGroup({});
  imgCat: any;
  imgFile: any;
  progressProfileImgMode: ProgressSpinnerMode = 'indeterminate';
  uploading = false;
  mBussines: ModelBussinesData = structuredClone(this.variables.mBusiness);
  mBrand: any[] = [];
  mCategory: any[] = [];
  mTypesDiscount = this.variables.mPromoTypes;

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

  mPromo: ModelPromo = this.variables.mPromo;
  action = '';

  eFrom = '';
  eTo = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public variables: VariablesService,
    public gFirebase: FirebaseService
  ) {
    this.action = data.action;
    this.mPromo = data.model;
  }
  ngOnDestroy(): void {
    this.action = '';
    this.mPromo = structuredClone(this.variables.mPromo);

    this.previews = [];
    this.selectedFiles = [];

    this.previewsVids = [];
    this.selectedFilesVids = [];

    this.imgToDelete = [];
    this.oImgToDelete = [];

    this.vidToDelete = [];
    this.vidToAdd = [];
    this.oVidToDelete = [];

    this.formPromo.reset();
  }
  async ngOnInit() {
    this.getLocalStorage();
    this.initServiceForm();

    if (this.mPromo.name != '' && this.action == 'update') {
      this.oImgToDelete = structuredClone(this.mPromo.images);
      this.oVidToDelete = structuredClone(this.mPromo.videos);
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
    console.log(this.mPromo);
    if (c != undefined) {
      this.mCategory = c;
    }
  }
  initServiceForm() {
    this.formPromo = new UntypedFormGroup({
      name: new UntypedFormControl(this.mPromo.name, Validators.required),
      discount: new UntypedFormControl(
        this.mPromo.discount,
        Validators.required
      ),
      desc: new UntypedFormControl(this.mPromo.desc),
      max: new UntypedFormControl(this.mPromo.max),
      type: new UntypedFormControl(this.mPromo.type),
      from: new UntypedFormControl(this.eFrom),
      to: new UntypedFormControl(this.eTo),
    });
  }
  /*Fill dynamic Form*/
  fullDynamic() {
    this.previews = this.mPromo.images;
    this.previewsVids = this.mPromo.videos;
    let d = new Date(this.mPromo.from);
    let d2 = new Date(this.mPromo.to);
    this.eFrom = d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear();
    this.eTo = d2.getMonth() + '/' + d2.getDate() + '/' + d2.getFullYear();

    this.initServiceForm();
  }
  /** Date change event */
  public onDateChangeFrom(event: any): void {
    let date = new Date(event.value);
    if (date.getTime() != undefined) {
      this.mPromo.from = date.getTime();
      console.log(this.mPromo.from);
    }
  }
  /** Date change event */
  public onDateChangeTo(event: any): void {
    let date = new Date(event.value);
    if (date.getTime() != undefined) {
      this.mPromo.to = date.getTime();
      console.log(this.mPromo.to);
    }
  }
  /** Read image url */
  getImgUrl(i: number): string {
    return this.mPromo.images[i];
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
    this.mPromo.videos = this.previewsVids;
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
    /** Check for new fields on object: */
    if (data.value.name == undefined || data.value.name == '') {
      this.somethingWrong();
      return;
    }
    if (data.value.desc == undefined || data.value.desc == '') {
      this.somethingWrong();
      return;
    }
    if (data.value.from == undefined || data.value.from == '') {
      this.somethingWrong();
      return;
    }
    if (data.value.to == undefined || data.value.to == '') {
      this.somethingWrong();
      return;
    }
    if (data.value.max == undefined || data.value.max == '') {
      this.somethingWrong();
      return;
    }
    if (data.value.discount == undefined || data.value.discount == '') {
      this.somethingWrong();
      return;
    }
    if (data.value.type == undefined || data.value.type == '') {
      this.somethingWrong();
      return;
    }
    if (this.mPromo.from > this.mPromo.to) {
      this.variables.launchSnackBar(
        'La fecha de inicio de la promo es de posterior a la de termino',
        '',
        3000
      );
      return;
    }
    this.mPromo.name = data.value.name;
    this.mPromo.desc = data.value.desc;
    this.mPromo.discount = data.value.discount;
    this.mPromo.max = data.value.max;
    this.mPromo.type = data.value.type;
    this.mPromo.dateTime = Date.now();

    if (type == 'create') {
      this.mPromo.sku = await this.variables.createCode(4);
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
      .createDBDoc<ModelPromo>(
        this.mPromo,
        action,
        this.selectedFiles,
        this.selectedFilesVids,
        'promos'
      )
      .then(() => {
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
      .updateDBDoc<ModelPromo>(
        this.mPromo,
        action,
        this.selectedFiles,
        this.selectedFilesVids,
        this.imgToDelete,
        this.vidToDelete,
        'promos'
      )
      .then(() => {
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
