import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalObservablesService } from 'src/app/core/global-observables.service';
import { VariablesService } from 'src/app/core/variables.service';
import {
  ModelInfDialogData,
  ModelProduct,
} from 'src/app/interfaces/Global.interface';

@Component({
  selector: 'app-add-cart',
  templateUrl: './add-cart.component.html',
  styleUrls: ['./add-cart.component.scss'],
})
export class AddCartComponent implements OnInit {
  public formAmount: UntypedFormGroup = new UntypedFormGroup({});
  mProduct: ModelProduct = this.variables.mProduct;

  constructor(
    public variables: VariablesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(MAT_DIALOG_DATA) public model: ModelProduct,
    public gObs: GlobalObservablesService
  ) {
    this.mProduct = data.model;
  }
  ngOnInit(): void {
    this.initSearchForm();
  }
  /** Init general form */
  initSearchForm() {
    this.formAmount = new UntypedFormGroup({
      amount: new UntypedFormControl(''),
    });
  }
  async addToCart(data: any) {
    await this.variables.addCart(data.value.amount, this.mProduct);
    this.gObs.setCartAdd = 'update';
  }
}
