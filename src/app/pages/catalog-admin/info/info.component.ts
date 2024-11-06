import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { FirebaseService } from 'src/app/core/firebase.service';
import { GlobalObservablesService } from 'src/app/core/global-observables.service';
import { VariablesService } from 'src/app/core/variables.service';
import {
  ModelBrand,
  ModelScheduleDay,
} from 'src/app/interfaces/Global.interface';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoComponent implements OnInit, AfterViewInit {
  public formBusiness: UntypedFormGroup = new UntypedFormGroup({});
  uploading = false;
  brand: ModelBrand = this.variables.mBrand;
  mBussines = this.variables.mBusiness;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  addOnBlur = true;

  brandList: ModelBrand[] = [];
  phoneList: any[] = [];
  addressList: any[] = [];
  addressList2: [] = [];
  scheduleList: any[] = [];
  sTyps: any[] = [];

  mScheduleDay: ModelScheduleDay = structuredClone(this.variables.mScheduleDay);
  mSchedule: ModelScheduleDay[] = [];

  mondayInit = '00:00 AM';
  mondayEnd = '11:59 PM';
  tuesdayInit = '00:00 AM';
  tuesdayEnd = '11:59 PM';
  wednesdayInit = '00:00 AM';
  wednesdayEnd = '11:59 PM';
  thursdayInit = '00:00 AM';
  thursdayEnd = '11:59 PM';
  fridayInit = '00:00 AM';
  fridayEnd = '11:59 PM';
  saturdayInit = '00:00 AM';
  saturdayEnd = '11:59 PM';
  sundayInit = '00:00 AM';
  sundayEnd = '11:59 PM';

  constructor(
    public variables: VariablesService,
    public gFirestore: FirebaseService,
    public gObservables: GlobalObservablesService,
    private changeDetector: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {}
  ngOnInit(): void {
    this.checkForBussinesLocal();
    this.initBusinessForm();

    this.gObservables.getBussines.subscribe((e) => {
      if (e.name != '') {
        this.checkForBussinesLocal();
      }
    });
    this.changeDetector.detectChanges();
  }
  async checkForBussinesLocal() {
    let b = await this.variables.getBusiness();
    if (b != undefined) {
      this.mBussines = b;
      this.mSchedule = structuredClone(this.mBussines.schedules);
      this.sTyps = structuredClone(this.mBussines.sTyps);
    }
    this.initBusinessForm();
    this.fullDynamic();
    this.checkForSchedule();
    this.changeDetector.detectChanges();
  }
  initBusinessForm() {
    this.formBusiness = new UntypedFormGroup({
      name: new UntypedFormControl(this.mBussines.name, Validators.required),
      desc: new UntypedFormControl(this.mBussines.desc),
      address: new UntypedFormArray([]),
      phones: new UntypedFormArray([]),
      brands: new UntypedFormArray([]),
    });
  }
  changeMInit(e: any, day: string, source: string) {
    let index = this.mSchedule.findIndex((o) => {
      return o.day == day;
    });

    if (this.mSchedule.length > 0) {
      if (index != undefined && index >= 0) {
        if (source == 'init') this.mSchedule[index].open = e;
        if (source == 'end') this.mSchedule[index].close = e;
      } else if (index != undefined && index < 0) {
        let nDay = structuredClone(this.variables.mScheduleDay);
        nDay.day = day;

        if (source == 'init') nDay.open = e;
        if (source == 'end') nDay.close = e;

        this.mSchedule.push(nDay);
      }
    } else {
      let nDay2 = structuredClone(this.variables.mScheduleDay);
      nDay2.day = day;

      if (source == 'init') nDay2.open = e;
      if (source == 'end') nDay2.close = e;

      this.mSchedule.push(nDay2);
    }

    this.checkForSchedule2(e, day, source);
  }
  // Check for schedule
  checkForSchedule2(e: any, day: string, source: string) {
    switch (day) {
      case 'monday':
        if (e == undefined || e == '') return;
        if (source === 'init') this.mondayInit = e;
        if (source === 'end') this.mondayEnd = e;
        break;
      case 'tuesday':
        if (e == undefined || e == '') return;
        if (source == 'init') this.tuesdayInit = e;
        if (source == 'end') this.tuesdayEnd = e;
        break;
      case 'wednesday':
        if (e == undefined || e == '') return;
        if (source === 'init') this.wednesdayInit = e;
        if (source === 'end') this.wednesdayEnd = e;
        break;
      case 'thursday':
        if (e == undefined || e == '') return;
        if (source === 'init') this.thursdayInit = e;
        if (source === 'end') this.thursdayEnd = e;
        break;
      case 'friday':
        if (e == undefined || e == '') return;
        if (source === 'init') this.fridayInit = e;
        if (source === 'end') this.fridayEnd = e;
        break;
      case 'saturday':
        if (e == undefined || e == '') return;
        if (source === 'init') this.saturdayInit = e;
        if (source === 'end') this.saturdayEnd = e;
        break;
      case 'sunday':
        if (e == undefined || e == '') return;
        if (source === 'init') this.sundayInit = e;
        if (source === 'end') this.sundayEnd = e;
        break;
    }
    this.changeDetector.detectChanges();
  }
  // Check for schedule
  checkForSchedule() {
    for (let d of this.mSchedule) {
      if (d.day == 'monday') {
        this.mondayInit = d.open;
        this.mondayEnd = d.close;
      }
      if (d.day == 'tuesday') {
        this.tuesdayInit = d.open;
        this.tuesdayEnd = d.close;
      }
      if (d.day == 'wednesday') {
        this.wednesdayInit = d.open;
        this.wednesdayEnd = d.close;
      }
      if (d.day == 'thursday') {
        this.thursdayInit = d.open;
        this.thursdayEnd = d.close;
      }
      if (d.day == 'friday') {
        this.fridayInit = d.open;
        this.fridayEnd = d.close;
      }
      if (d.day == 'saturday') {
        this.saturdayInit = d.open;
        this.saturdayEnd = d.close;
      }
      if (d.day == 'sunday') {
        this.sundayInit = d.open;
        this.sundayEnd = d.close;
      }
    }
  }
  // checkForSchedule2(day: string, source: string) {
  //   let r = '';
  //   const i = this.mSchedule.findIndex((e) => {
  //     return e.day == day;
  //   });
  //   if (i != undefined) {
  //     if (i > 0 && this.mSchedule.length > 0) {

  //       if (source == 'init') r = this.mSchedule[i].open;
  //       if (source == 'end') r = this.mSchedule[i].close;
  //     }
  //   }
  //   return r;
  // }
  /*Fill dynamic Form*/
  async fullDynamic() {
    if (this.mBussines.address != undefined) {
      if (this.mBussines.address.length > 0) {
        for (let s of this.mBussines.address) {
          this.addAddress(s.a);
        }
      }
    }
    if (this.mBussines.phones != undefined) {
      if (this.mBussines.phones.length > 0) {
        for (let s of this.mBussines.phones) {
          this.addPhone(s.phone);
        }
      }
    }
    if (this.mBussines.brands != undefined) {
      if (this.mBussines.brands.length > 0) {
        for (let s of this.mBussines.brands) {
          this.addBrand(s.brand);
        }
      }
    }
  }
  /* :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::. ADDRESS */
  /** TODO: Agregar nuevo field en form 🤨 */
  addAddress(value: string): void {
    const refSkills = this.formBusiness.get('address') as UntypedFormArray;
    refSkills.push(this.initAddress(value));
  }
  /** TODO: Iniciar el formulario hijo 🤣 */
  initAddress(value: string): UntypedFormGroup {
    return new UntypedFormGroup({
      a: new UntypedFormControl(value, Validators.required),
    });
  }
  /** Delete subcat Celebrated */
  async deleteAddress(v: [], e: any, index: any) {
    this.removeAddress(v, index);
  }
  /** Remove Form level */
  removeAddress(target: any, index: number) {
    const refSkills = this.formBusiness.get('address') as UntypedFormArray;
    refSkills.removeAt(index);
  }
  /* :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::. PHONES */
  /** TODO: Agregar nuevo field en form 🤨 */
  addPhone(value: string): void {
    const refSkills = this.formBusiness.get('phones') as UntypedFormArray;
    refSkills.push(this.initPhone(value));
  }
  /** TODO: Iniciar el formulario hijo 🤣 */
  initPhone(value: string): UntypedFormGroup {
    return new UntypedFormGroup({
      phone: new UntypedFormControl(value, Validators.required),
    });
  }
  /** Delete subcat Celebrated */
  async deletePhone(v: [], e: any, index: any) {
    this.removePhone(v, index);
  }
  /** Remove Form level */
  removePhone(target: any, index: number) {
    const refSkills = this.formBusiness.get('phones') as UntypedFormArray;
    refSkills.removeAt(index);
  }
  /** Add new sTyps */
  addTags(event: any): void {
    const value = (event.value || '').trim();
    if (value) {
      this.sTyps.push(value);
    }
    event.chipInput!.clear();
  }
  /** Remove sTyps */
  removesTyp(v: string): void {
    const index = this.sTyps.indexOf(v);
    if (index >= 0) {
      this.sTyps.splice(index, 1);
    }
  }
  /* :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::. BRANDS */
  /** TODO: Agregar nuevo field en form 🤨 */
  addBrand(value: string): void {
    const refSkills = this.formBusiness.get('brands') as UntypedFormArray;
    refSkills.push(this.initBrand(value));
  }
  /** TODO: Iniciar el formulario hijo 🤣 */
  initBrand(value: string): UntypedFormGroup {
    return new UntypedFormGroup({
      brand: new UntypedFormControl(value, Validators.required),
    });
  }
  /** Delete subcat Celebrated */
  async deleteBrand(v: [], e: any, index: any) {
    this.removeBrand(v, index);
  }
  /** Remove Form level */
  removeBrand(target: any, index: number) {
    const refSkills = this.formBusiness.get('brands') as UntypedFormArray;
    refSkills.removeAt(index);
  }
  /** TODO: Obtener referencia a un formControl **/
  getCtrl(key: string, form: UntypedFormGroup): any {
    return form.get(key);
  }
  initSave(data: any) {
    if (data.value.name == '') {
      this.variables.launchSnackBar('Nombre vacio', '', 2500);
      return;
    }
    if (data.value.desc == '') {
      this.variables.launchSnackBar('Descripción vacio', '', 2500);
      return;
    }
    if (data.value.address.length <= 0) {
      this.variables.launchSnackBar('Agrega al menos una dirección', '', 2500);
      return;
    }
    if (data.value.phones.length <= 0) {
      this.variables.launchSnackBar('Agrega al menos una teléfono', '', 2500);
      return;
    }
    if (this.mSchedule.length <= 0) {
      this.variables.launchSnackBar('No has definidos los horarios', '', 2500);
      return;
    }

    this.mBussines.address = data.value.address;
    this.mBussines.phones = data.value.phones;
    this.mBussines.brands = data.value.brands;
    this.mBussines.name = data.value.name;
    this.mBussines.desc = data.value.desc;
    this.mBussines.schedules = this.mSchedule;
    this.mBussines.sTyps = this.sTyps;

    this.saveBusiness();
  }
  saveBusiness() {
    this.gFirestore.setBusinessData(this.mBussines);
  }
}
