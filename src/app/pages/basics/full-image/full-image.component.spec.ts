import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullImageComponent } from './full-image.component';

describe('FullImageComponent', () => {
  let component: FullImageComponent;
  let fixture: ComponentFixture<FullImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FullImageComponent]
    });
    fixture = TestBed.createComponent(FullImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
