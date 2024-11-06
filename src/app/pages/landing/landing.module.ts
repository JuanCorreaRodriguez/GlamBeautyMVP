import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { BasicsModule } from '../basics/basics.module';

import { register } from 'swiper/element/bundle';
import { MaterialModule } from '../material/material.module';

// register Swiper custom elements
register();

@NgModule({
  declarations: [LandingComponent],
  imports: [CommonModule, LandingRoutingModule, BasicsModule, MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LandingModule {}
