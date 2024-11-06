import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { VariablesService } from 'src/app/core/variables.service';
import { ModelCart } from 'src/app/interfaces/Global.interface';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent implements OnInit {
  public formName: UntypedFormGroup = new UntypedFormGroup({});
  mCart: ModelCart[] = [];

  constructor(public variables: VariablesService, public router: Router) {}

  async ngOnInit() {
    this.initForm();
    this.mCart = await this.variables.getCart();
  }

  getItemTotal(i: number) {
    return this.mCart[i].amount * this.mCart[i].product.price;
  }
  getCartTotal() {
    let total = 0;
    for (let i of this.mCart) {
      total = total + i.amount * i.product.price;
    }
    return total.toFixed(2);
  }
  keepShopping() {
    this.router.navigate(['catalog']);
  }
  /** Open Link */
  async shareWhatsApp() {
    let message = await this.generateOrder();
    let u = 'https://wa.me/+528443186436' + '/?text=' + message;
    window.open(u, '_blank')?.focus();
  }
  async generateOrder() {
    let items = '';
    for (let i = 0; i < this.mCart.length; i++) {
      // Calcula la longitud disponible para las variables y el precio
      const availableLength = 30; // Longitud total menos 1 para el punto

      // Concatena las variables y el precio
      const formattedString =
        this.mCart[i].product.name + ' x' + this.mCart[i].amount;
      // Calcula cuántos espacios son necesarios para completar la longitud requerida
      const spacesNeeded = Math.max(
        0,
        availableLength - formattedString.length
      );

      // Crea el string final con los espacios y el punto en la penúltima posición
      const finalString = `${
        this.mCart[i].product.name + ' x' + this.mCart[i].amount
      }${'.'.repeat(spacesNeeded - 1)}${
        '$' + this.mCart[i].product.price * this.mCart[i].amount + '%0A'
      }`;

      items += finalString;
    }
    return (
      'Hola, soy ' +
      this.formName.value.name +
      '! %0AHe creado mi pedido: %0A%0A' +
      items +
      '%0ATotal: $' +
      this.getCartTotal() +
      ' MXN%0A%0A¿Podría confirmar mi pedido?'
    );
  }
  /** Init general form */
  initForm() {
    this.formName = new UntypedFormGroup({
      name: new UntypedFormControl(''),
    });
  }
}
