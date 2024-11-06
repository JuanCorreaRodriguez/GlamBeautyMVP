import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
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
  ModelService,
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
import { UpsertServiceComponent } from '../upsert-service/upsert-service.component';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
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
export class ServiceComponent {
  public formSearch: UntypedFormGroup = new UntypedFormGroup({});
  pageIndex = 0;
  pageSize = 5;

  searchTerm = '';
  filterd = false;
  filteredList: ModelService[] = [];
  serviceList: ModelService[] = [];
  mService: ModelService = structuredClone(this.variables.mService);
  vStyle = 'card';

  // Table view

  dataSource = new MatTableDataSource(this.filteredList);
  columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  // columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: ModelService | null = this.variables.mService;

  displayedColumns: string[] = [
    'sku',
    'name',
    'discount',
    'price',
    'type',
    'duration',
    'link',
    'options',
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns];
  private paginator: MatPaginator | null = null;

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

  async ngOnInit() {
    this.initSearchForm();
    this.gObservables.getSer.subscribe((e) => {
      if (e == 'create' || e == 'delete' || e == 'update') {
        this.dialog.closeAll();
      }
      if (e == 'delete') {
        this.variables.launchSnackBar('Servicio eliminado', '', 3000);
      }
      if (e == 'create') {
        this.variables.launchSnackBar('Servicio creado', '', 3000);
      }
      if (e != '') {
        this.checkProductLocal();
        this.gObservables.setSer = '';
        this.dialog.closeAll();
      }
    });
    this.vStyle = await this.variables.getSetting('gl_vss');

    this.checkProductLocal();
  }
  async checkProductLocal() {
    this.serviceList = [];
    this.serviceList = await this.variables.getServices();
    this.filteredList = this.serviceList;

    if (this.serviceList.length == 0) {
      this.gFirebase.getServices().then((e) => {
        if (e.length > 0) {
          this.serviceList = e;
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
    this.filteredList = this.serviceList.filter(
      (entry) =>
        entry.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.desc.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filterd = true;
  }
  editProduct(model: ModelService) {
    this.mService = structuredClone(model);
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
      model: this.mService,
    };
    this.dialog
      .open(UpsertServiceComponent, dialogConfig)
      .afterClosed()
      .subscribe((o) => {
        this.mService = structuredClone(this.variables.mService);
      });
  }
  checkImage(i: number): string {
    return this.serviceList[i].images[0] == ''
      ? '../../../../assets/img/glam_logo.webp'
      : this.serviceList[i].images[0];
    return '';
  }
  checkSubcategory(i: number, j: number) {
    return this.serviceList[i].subcategories[j];
  }
  // Delete category init
  deleteProduct(model: ModelService) {
    let m: ModelInfDialogData = {
      cancel: 'Cancelar',
      continue: 'Continuar',
      title: '¿Eliminar servicio?',
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
  continueDelete(model: ModelService) {
    this.gFirebase.deleteDBDoc(model, 'services');
  }
  getTanking(model: ModelService): number {
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
    console.log(value.value);
    this.vStyle = value.value;
    this.variables.setSetting(value.value, 'gl_vss');
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
    this.dataSource = new MatTableDataSource<ModelService>(this.filteredList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;
    this.changeDetector.detectChanges();
  }
  /** Update user info */
  async copyInviteLink(id: string) {
    this.cliboard.copy('test');
    this.variables.launchSnackBar('Link copiado al portapapeles', '', 4000);
  }
  /** Share invite via WhatsApp */
  async shareLink(model: ModelService) {
    let message =
      'Te compartimos el link de nuestro servicio:%0A%0A' +
      this.variables.serviceUrl +
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
  updatePage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
  }
  syncServies() {
    this.gFirebase.getServices();
  }
}
