import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModelBussinesData } from '../interfaces/Global.interface';
import { VariablesService } from './variables.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalObservablesService {
  private theme: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private cartAdd: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private pObs: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private sObs: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private prObs: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private cObs: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private bussines: BehaviorSubject<ModelBussinesData> =
    new BehaviorSubject<ModelBussinesData>(this.variables.mBusiness);

  constructor(public variables: VariablesService) {}

  /** GETTER SETTER THEME */
  set setTheme(theme: any) {
    this.theme.next(theme);
  }
  get getTheme() {
    return this.theme.asObservable();
  }
  /** PRODUCT */
  set setProd(v: any) {
    this.pObs.next(v);
  }
  get getProd() {
    return this.pObs.asObservable();
  }
  /** SERVICE */
  set setSer(v: any) {
    this.sObs.next(v);
  }
  get getSer() {
    return this.sObs.asObservable();
  }
  /** PROMO */
  set setPro(v: any) {
    this.prObs.next(v);
  }
  get getPro() {
    return this.prObs.asObservable();
  }
  /** CATEGORY */
  set setCat(v: any) {
    this.cObs.next(v);
  }
  get getCat() {
    return this.cObs.asObservable();
  }
  /** BUSSINES */
  set setBussines(v: ModelBussinesData) {
    this.bussines.next(v);
  }
  get getBussines() {
    return this.bussines.asObservable();
  }
  /** CART */
  set setCartAdd(v: string) {
    this.cartAdd.next(v);
  }
  get getCartAdd() {
    return this.cartAdd.asObservable();
  }
}
