import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
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
  ModelPromo,
} from 'src/app/interfaces/Global.interface';
import { DialogsComponent } from '../../basics/dialogs/dialogs.component';
import { UpsertProductComponent } from '../upsert-product/upsert-product.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FullImageComponent } from '../../basics/full-image/full-image.component';
import { FullVideoComponent } from '../../basics/full-video/full-video.component';
import { UpsertServiceComponent } from '../upsert-service/upsert-service.component';
import { UpsertromosComponent } from '../upsertromos/upsertromos.component';

@Component({
  selector: 'app-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.scss'],
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
export class PromosComponent implements OnInit {
  public formPromos: UntypedFormGroup = new UntypedFormGroup({});
  searchTerm = '';
  filterd = false;
  filteredList: ModelPromo[] = [];
  promoList: ModelPromo[] = [];
  mPromo: ModelPromo = structuredClone(this.variables.mPromo);
  vStyle = 'card';

  // Table view

  dataSource = new MatTableDataSource(this.filteredList);
  columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  // columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: ModelPromo | null = this.variables.mPromo;

  displayedColumns: string[] = [
    'sku',
    'name',
    'discount',
    'count',
    'duration',
    'link',
    'options',
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns];
  private paginator: MatPaginator | null = null;
  @ViewChild('paginatorTable', { static: false })
  set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
  }
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
    this.gObservables.getPro.subscribe((e) => {
      if (e == 'delete') {
        this.variables.launchSnackBar('Promo eliminada', '', 3000);
      }
      if (e == 'create') {
        this.variables.launchSnackBar('Promo creada', '', 3000);
      }
      if (e == 'update') {
        this.variables.launchSnackBar('Promo actualizada', '', 3000);
      }
      if (e != '' && !e.includes('error')) {
        this.gObservables.setPro = '';
        this.checkProductLocal();
        this.dialog.closeAll();
      }
    });

    this.vStyle = await this.variables.getSetting('gl_vsp');

    this.checkProductLocal();
  }
  async checkProductLocal() {
    this.promoList = [];
    this.promoList = await this.variables.getPromos();
    this.filteredList = this.promoList;

    if (this.promoList.length == 0) {
      this.gFirebase.getPromos().then((e) => {
        if (e.length > 0) {
          this.promoList = e;
          this.filteredList = e;
        }
      });
    }
    this.setDataSource();
    this.changeDetector.detectChanges();
  }
  /** Init general form */
  initSearchForm() {
    this.formPromos = new UntypedFormGroup({
      keyword: new UntypedFormControl(''),
    });
    //this.formGeneralChanges();
  }

  filterEntries() {
    this.filteredList = this.promoList.filter(
      (entry) =>
        entry.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.sku.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        entry.desc.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filterd = true;
  }
  editProduct(model: ModelPromo) {
    this.mPromo = structuredClone(model);
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
      model: this.mPromo,
    };
    this.dialog
      .open(UpsertromosComponent, dialogConfig)
      .afterClosed()
      .subscribe((o) => {
        this.mPromo = structuredClone(this.variables.mPromo);
      });
  }
  checkImage(i: number): string {
    return this.promoList[i].images[0] == ''
      ? '../../../../assets/img/glam_logo.webp'
      : this.promoList[i].images[0];
    return '';
  }
  // Delete category init
  deleteProduct(model: ModelPromo) {
    let m: ModelInfDialogData = {
      cancel: 'Cancelar',
      continue: 'Continuar',
      title: '¿Eliminar promo?',
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
  continueDelete(model: ModelPromo) {
    this.gFirebase.deleteDBDoc(model, 'promos');
  }
  changeView(value: any) {
    console.log(value.value);
    this.vStyle = value.value;
    this.variables.setSetting(value.value, 'gl_vsp');
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
    this.dataSource = new MatTableDataSource<ModelPromo>(this.filteredList);
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
  async shareLink(model: ModelPromo) {
    let message =
      'Te compartimos el link de nuestra promo:%0A%0A' +
      this.variables.promosUrl +
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
  syncPromos() {
    this.gFirebase.getPromos();
  }
}
