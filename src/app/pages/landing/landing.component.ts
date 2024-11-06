import { Component, OnInit } from '@angular/core';
import { SwiperOptions } from 'swiper';
import Swiper, { Autoplay } from 'swiper';
import { AddCartComponent } from '../basics/add-cart/add-cart.component';
import { VariablesService } from 'src/app/core/variables.service';
import { Router } from '@angular/router';
Swiper.use([Autoplay]);

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
  mOpinions = this.variables.mOpinions;
  mBusiness = this.variables.mBusiness;

  constructor(public variables: VariablesService, public router: Router) {}

  async ngOnInit() {
    this.mBusiness = await this.variables.getBusiness();
  }
  goCatalog() {
    this.router.navigate(['catalog']);
  }
}
