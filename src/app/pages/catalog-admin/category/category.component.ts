import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { VariablesService } from 'src/app/core/variables.service';
import { MatDialog } from '@angular/material/dialog';
import {
  ModelCategory,
  ModelInfDialogData,
  ModelProduct,
} from 'src/app/interfaces/Global.interface';
import { UpsertCategoryComponent } from '../upsert-category/upsert-category.component';
import { GlobalObservablesService } from 'src/app/core/global-observables.service';
import { FirebaseService } from 'src/app/core/firebase.service';
import { DialogsComponent } from '../../basics/dialogs/dialogs.component';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent {
  public formSearch: UntypedFormGroup = new UntypedFormGroup({});
  searchTerm = '';
  filteredList: ModelCategory[] = [];
  filterd = false;
  categoryList: ModelCategory[] = [];
  mCategory: ModelCategory = this.variables.mCategory;
  oCategory: ModelCategory = this.variables.mCategory;

  constructor(
    public variables: VariablesService,
    public dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    public gObservables: GlobalObservablesService,
    public router: Router,
    public gFirebase: FirebaseService
  ) {
    this.filterd = false;
  }
  async ngOnInit() {
    this.initSearchForm();
    this.gObservables.getCat.subscribe((e) => {
      if (e != '' && !e.includes('error')) {
        this.dialog.closeAll();
        this.checkCategoriesLocal();
        this.gObservables.setCat = '';
      }
    });
    this.checkCategoriesLocal();
  }
  async checkCategoriesLocal() {
    this.categoryList = await this.variables.getCategories();
    this.filteredList = this.categoryList;

    if (this.categoryList.length == 0) {
      this.gFirebase.subscribeCatUpdates().then((e) => {
        if (e.length > 0) {
          this.categoryList = e;
          this.filteredList = e;
        }
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
  async editProduct(model: ModelProduct) {
    this.variables.setProductToEdit(model);
    this.router.navigate(['edit/' + model.sku]);
  }
  filterEntries() {
    this.filteredList = this.categoryList.filter((entry) =>
      entry.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filterd = true;
  }
  editCategory(model: ModelCategory) {
    this.mCategory = structuredClone(model);
    this.oCategory = structuredClone(model);
    this.createCategory('update');
  }
  createCategory(action: string) {
    const w = this.variables.geDialogWidth4596();
    this.dialog.open(UpsertCategoryComponent, {
      maxWidth: w,
      minWidth: w,
      width: w,
      disableClose: false,
      data: {
        action: action,
        model: this.mCategory,
        original: this.oCategory,
      },
    });
  }
  checkImage(i: number): string {
    return this.categoryList[i].image == ''
      ? '../../../../assets/img/glam_logo.webp'
      : this.categoryList[i].image;
  }
  checkSubcategory(i: number, j: number) {
    return this.categoryList[i].subcategories[j].subcategories;
  }
  // Delete category init
  deleteCategory(model: ModelCategory) {
    let m: ModelInfDialogData = {
      cancel: 'Cancelar',
      continue: 'Continuar',
      title: '¿Eliminar categoria?',
      message: '',
    };
    const w = this.variables.geDialogWidth4596();
    this.dialog
      .open(DialogsComponent, {
        maxWidth: w,
        minWidth: w,
        width: w,
        disableClose: false,
        data: {
          model: m,
        },
      })
      .afterClosed()
      .subscribe((o) => {
        if (o) {
          this.continueDelete(model);
        }
      });
  }
  continueDelete(model: ModelCategory) {
    this.gFirebase.deleteCategory(model);
  }
}
