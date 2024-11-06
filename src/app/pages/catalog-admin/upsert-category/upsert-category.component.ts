import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormArray,
} from '@angular/forms';
import { ModelCategory } from 'src/app/interfaces/Global.interface';
import { VariablesService } from 'src/app/core/variables.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { FirebaseService } from 'src/app/core/firebase.service';

@Component({
  selector: 'app-upsert-category',
  templateUrl: './upsert-category.component.html',
  styleUrls: ['./upsert-category.component.scss'],
})
export class UpsertCategoryComponent implements OnInit {
  public formCategory: UntypedFormGroup = new UntypedFormGroup({});
  imgCat: any;
  imgFile: any;
  progressProfileImgMode: ProgressSpinnerMode = 'indeterminate';
  uploading = false;
  subcategories: [] = [];

  model: ModelCategory = structuredClone(this.variables.mCategory);
  oModel: ModelCategory = structuredClone(this.variables.mCategory);
  action = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public variables: VariablesService,
    public gFirebase: FirebaseService
  ) {
    this.action = data.action;
    this.model = structuredClone(data.model);
    this.oModel = structuredClone(data.model);
  }

  ngOnInit(): void {
    this.initCategoryForm();
    if (this.model.name != '' && this.action == 'update') {
      this.fullDynamic();
    }
  }
  initCategoryForm() {
    // if (this.model.desc == '' && this.action == 'create') {
    //   this.model.desc = 'Descripcion';
    // }
    this.formCategory = new UntypedFormGroup({
      name: new UntypedFormControl(this.model.name, Validators.required),
      desc: new UntypedFormControl(this.model.desc),
      subcategories: new UntypedFormArray(this.subcategories),
    });
  }
  /*Fill dynamic Form*/
  fullDynamic() {
    if (this.model.subcategories != undefined) {
      if (this.model.subcategories.length > 0) {
        for (let s of this.model.subcategories) {
          this.addSubCat(s.subcategory);
        }
      }
    }
  }
  /** Update Image Profile **/
  loadImageCategory() {
    document.getElementById('imgProfileUpdate')?.click();
  }
  /** Update card image **/
  async updateCardImage(event: any) {
    this.imgFile = event.target.files;
    let reader = new FileReader();
    if (this.imgFile != null) {
      reader.readAsDataURL(this.imgFile[0]);
      reader.onloadend = () => {
        this.imgCat = reader.result;
        this.model.image = this.imgCat;
      };
    }
  }
  /* :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::. PHONES */
  /** TODO: Agregar nuevo field en form 🤨 */
  addSubCat(value: string): void {
    const refSkills = this.formCategory.get(
      'subcategories'
    ) as UntypedFormArray;
    refSkills.push(this.initSubcat(value));
  }
  /** TODO: Iniciar el formulario hijo 🤣 */
  initSubcat(value: string): UntypedFormGroup {
    return new UntypedFormGroup({
      subcategory: new UntypedFormControl(value, Validators.required),
    });
  }
  /** Delete subcat Celebrated */
  async deleteSubcat(v: [], e: any, index: any) {
    this.removeSubcat(v, index);
  }
  /** Remove Form level */
  removeSubcat(target: any, index: number) {
    const refSkills = this.formCategory.get(
      'subcategories'
    ) as UntypedFormArray;
    refSkills.removeAt(index);
  }
  /** TODO: Obtener referencia a un formControl **/
  getCtrl(key: string, form: UntypedFormGroup): any {
    return form.get(key);
  }
  /** Update Card General Data **/
  async createCategory(data: any, type: string) {
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
    if (data.value.subcategories.length > 0) {
      let scs: any[] = [];
      for (let s of data.value.subcategories) {
        scs.push(s.subcategory);
      }
      this.model.subcategories = data.value.subcategories;
    }

    this.model.name = data.value.name;
    this.model.desc = data.value.desc;
    this.model.id = await this.variables.createCode(4);

    if (type == 'create') {
      this.createCat(type);
    } else if (type == 'update') {
      this.updateCat(type);
    }
  }
  somethingWrong() {
    this.variables.launchSnackBar('Algunos campos estan vacios...', '', 5000);
  }
  async createCat(action: string) {
    this.uploading = true;
    let child = 'categories/' + this.model.name + '.png';
    let i: any = null;
    if (this.imgFile != undefined) {
      if (this.imgFile.length > 0) {
        i = this.imgFile[0];
      }
    }
    this.gFirebase.createCategory(this.model, action, i, child).then(() => {
      this.variables.launchSnackBar('Categoria creada', '', 3000);
      this.uploading = false;
    });
  }
  /** Update Event check first if event has completed */
  async updateCat(action: string) {
    this.uploading = true;
    let child = 'categories/' + this.model.name + '.png';
    let i: any = null;
    if (this.imgFile != undefined) {
      if (this.imgFile.length > 0) {
        i = this.imgFile[0];
      }
    }
    this.gFirebase
      .updateCategory(this.model, this.oModel, action, i, child)
      .then(() => {
        setTimeout(() => {
          this.uploading = false;
          this.variables.launchSnackBar('Categoria actualizada', '', 3000);
        }, 2000);
      });
  }
}
