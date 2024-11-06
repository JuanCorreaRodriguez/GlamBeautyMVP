import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertromosComponent } from './upsertromos.component';

describe('UpsertromosComponent', () => {
  let component: UpsertromosComponent;
  let fixture: ComponentFixture<UpsertromosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpsertromosComponent]
    });
    fixture = TestBed.createComponent(UpsertromosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
