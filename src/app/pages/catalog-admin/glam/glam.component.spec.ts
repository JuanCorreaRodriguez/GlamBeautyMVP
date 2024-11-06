import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlamComponent } from './glam.component';

describe('GlamComponent', () => {
  let component: GlamComponent;
  let fixture: ComponentFixture<GlamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlamComponent]
    });
    fixture = TestBed.createComponent(GlamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
