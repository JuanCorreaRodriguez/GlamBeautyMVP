import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/core/firebase.service';
import { GlobalObservablesService } from 'src/app/core/global-observables.service';
import { VariablesService } from 'src/app/core/variables.service';
import {
  ModelInfDialogData,
  ModelProduct,
} from 'src/app/interfaces/Global.interface';
import { DialogsComponent } from '../../basics/dialogs/dialogs.component';
import { UpsertProductComponent } from '../upsert-product/upsert-product.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FullImageComponent } from '../../basics/full-image/full-image.component';
import { FullVideoComponent } from '../../basics/full-video/full-video.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ProductComponent implements AfterViewInit {
  public formSearch: UntypedFormGroup = new UntypedFormGroup({});
  pageIndex = 0;
  pageSize = 5;
  searchTerm = '';
  filterd = false;
  filteredList: ModelProduct[] = [];
  productList: ModelProduct[] = [];
  mProduct: ModelProduct = structuredClone(this.variables.mProduct);
  vStyle = 'card';

  // Table view

  dataSource = new MatTableDataSource(this.filteredList);
  columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  // columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: ModelProduct | null = this.variables.mProduct;

  displayedColumns: string[] = [
    'sku',
    'name',
    'stock',
    'discount',
    'price',
    'brand',
    'link',
    'options',
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns];

  @ViewChild('paginatorTable', { static: false }) matPaginator: MatPaginator =
    {} as MatPaginator;
  @ViewChild('matSort') matSort: MatSort = {} as MatSort;

  constructor(
    public variables: VariablesService,
    public router: Router,
    public dialog: MatDialog,
    public cliboard: Clipboard,
    private changeDetector: ChangeDetectorRef,
    public gObservables: GlobalObservablesService,
    public gFirebase: FirebaseService,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.filterd = false;
  }
  ngAfterViewInit(): void {}

  async ngOnInit() {
    this.initSearchForm();
    this.gObservables.getProd.subscribe((e) => {
      if (e == 'create' || e == 'delete' || e == 'update') {
        this.gObservables.setProd = '';
        this.dialog.closeAll();
      }
      if (e == 'delete') {
        this.variables.launchSnackBar('Producto eliminado', '', 3000);
      }
      if (e == 'create') {
        this.variables.launchSnackBar('Producto creado', '', 3000);
      }
      if (e != '') this.checkProductLocal();
    });
    this.vStyle = await this.variables.getSetting('gl_vs');
    this.checkProductLocal();
  }
  async checkProductLocal() {
    this.productList = [];
    this.productList = await this.variables.getProducts();
    this.filteredList = this.productList;

    if (this.productList.length == 0) {
      this.gFirebase.getProducts().then((e) => {
        if (e.length > 0) {
          this.productList = e;
          this.filteredList = e;
        }
      });
    }
    setTimeout(() => {
      this.setDataSource();
    }, 250);
    this.changeDetector.detectChanges();
  }
  /** Init general form */
  initSearchForm() {
    this.formSearch = new UntypedFormGroup({
      keyword: new UntypedFormControl(''),
    });
    //this.formGeneralChanges();
  }

  filterEntries() {
    this.filteredList = this.productList.filter(
      (entry) =>
        entry.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.desc.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filterd = true;
  }
  editProduct(model: ModelProduct) {
    this.mProduct = structuredClone(model);
    this.createProduct('update');
  }
  createProduct(action: string) {
    const w = this.variables.geDialogWidth6596();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.maxWidth = w;
    dialogConfig.minWidth = w;
    dialogConfig.width = w;
    dialogConfig.height = 'calc(100vh - 50px - 2vh)';
    dialogConfig.position = { bottom: '1vh' };
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      action: action,
      model: this.mProduct,
    };
    this.dialog
      .open(UpsertProductComponent, dialogConfig)
      .afterClosed()
      .subscribe((o) => {
        this.mProduct = structuredClone(this.variables.mProduct);
      });
  }
  checkImage(i: number): string {
    if (this.productList[i].images.length > 0) {
      return this.productList[i].images[0];
    } else {
      return '../../../../assets/img/glam_logo.webp';
    }
  }
  checkSubcategory(i: number, j: number) {
    return this.productList[i].subcategories[j];
  }
  // Delete category init
  deleteProduct(model: ModelProduct) {
    let m: ModelInfDialogData = {
      cancel: 'Cancelar',
      continue: 'Continuar',
      title: '¿Eliminar producto?',
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
  continueDelete(model: ModelProduct) {
    this.gFirebase.deleteDBDoc(model, 'products');
  }
  getTanking(model: ModelProduct): number {
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
  changeView(value: any) {
    this.vStyle = value.value;
    this.variables.setSetting(value.value, 'gl_vs');
  }
  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  /** Set data source */
  setDataSource() {
    this.dataSource = new MatTableDataSource<ModelProduct>(this.filteredList);
    this.dataSource.paginator = this.matPaginator;
    this.dataSource.sort = this.matSort;
    this.changeDetector.detectChanges();
  }
  /** Update user info */
  async copyInviteLink(id: string) {
    this.cliboard.copy('test');
    this.variables.launchSnackBar('Link copiado al portapapeles', '', 4000);
  }
  /** Share invite via WhatsApp */
  async shareLink(model: ModelProduct) {
    let message =
      'Te compartimos el link del producto:%0A%0A' +
      this.variables.catalogUrl +
      model.sku +
      '%0A%0ATambién te recordamos que puedes consultar nuestro catálogo, crear tu pedido, ver promociones y revisar nuestros servicios desde nuestra página web para tu mayor comodidad';
    let u = 'https://wa.me/+528443186436/?text=' + message;
    window.open(u, '_blank')?.focus();
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
  prenventProp(e: MouseEvent) {
    e.stopPropagation();
  }
  syncProducts() {
    this.gFirebase.getProducts();
  }
  updatePage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    // this.filteredList =
    this.changeDetector.detectChanges();
  }
}
