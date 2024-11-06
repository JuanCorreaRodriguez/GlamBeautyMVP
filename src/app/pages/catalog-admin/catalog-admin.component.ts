import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDrawer } from '@angular/material/sidenav';
import { GlobalObservablesService } from 'src/app/core/global-observables.service';
import { ModelCategory } from 'src/app/interfaces/Global.interface';
import { VariablesService } from 'src/app/core/variables.service';
import { FirebaseService } from 'src/app/core/firebase.service';

@Component({
  selector: 'app-catalog-admin',
  templateUrl: './catalog-admin.component.html',
  styleUrls: ['./catalog-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogAdminComponent implements OnInit {
  showFiller = false;
  @ViewChild('drawer') drawer: MatDrawer = {} as MatDrawer;
  categoryList: ModelCategory[] = [];

  constructor(
    private router: Router,
    public gFirebase: FirebaseService,
    public variables: VariablesService,
    public gObservables: GlobalObservablesService,
    private changeDetector: ChangeDetectorRef
  ) {
    this.checkPreviews();
  }

  ngOnInit(): void {
    this.gFirebase.subscribeCatUpdates();
    this.gFirebase.subscribeSnapUpdates('promos');
    this.gFirebase.subscribeSnapUpdates('products');
    this.gFirebase.subscribeSnapUpdates('services');
    this.gFirebase.subscribeBussinesUpdates();
    this.checkCategoriesLocal();
    this.checkForBussinesLocal();

    this.gObservables.getCat.subscribe((e) => {
      if (e == 'delete') {
        this.variables.launchSnackBar('Categoria eliminada', '', 3000);
      }
      if (e == 'create') {
        this.variables.launchSnackBar('Categoria creada', '', 3000);
      }

      if (e != '') this.checkCategoriesLocal();

      // this.gObservables.setCat = '';
    });

    this.gObservables.getBussines.subscribe((e) => {
      if (e.name != '') {
        this.gObservables.setBussines = this.variables.mBusiness;
        this.variables.launchSnackBar(
          'Información de Glam actualizada',
          '',
          2000
        );
      }
      // this.gObservables.setBussines = this.variables.mBusiness;
    });

    this.productsView();
  }
  async checkPreviews() {
    let prod = await this.variables.getSetting('gl_vs');
    let ser = await this.variables.getSetting('gl_vss');
    let pro = await this.variables.getSetting('gl_vsp');

    if (prod == undefined || prod == '') {
      this.variables.setSetting('card', 'gl_vs');
    }
    if (ser == undefined || prod == '') {
      this.variables.setSetting('card', 'gl_vss');
    }
    if (pro == undefined || prod == '') {
      this.variables.setSetting('card', 'gl_vsp');
    }
  }
  productsView() {
    let e = this.variables.getSetting('gl_vs');
    if (e == undefined) this.variables.setSetting('card', 'gl_vs');
  }
  actionClick(action: string) {
    this.router.navigate([action]);
    this.drawer.toggle();
  }
  async checkCategoriesLocal() {
    this.categoryList = await this.variables.getCategories();

    if (this.categoryList.length == 0) {
      this.gFirebase.subscribeCatUpdates();
    }
    this.changeDetector.detectChanges();
  }
  async checkForBussinesLocal() {
    let b = await this.variables.getBusiness();
    if (b != undefined) {
      if (b.name == '') {
        this.gFirebase.subscribeBussinesUpdates();
      }
    }
    this.changeDetector.detectChanges();
  }
}
