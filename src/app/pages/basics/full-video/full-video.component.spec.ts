import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullVideoComponent } from './full-video.component';

describe('FullVideoComponent', () => {
  let component: FullVideoComponent;
  let fixture: ComponentFixture<FullVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FullVideoComponent]
    });
    fixture = TestBed.createComponent(FullVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
