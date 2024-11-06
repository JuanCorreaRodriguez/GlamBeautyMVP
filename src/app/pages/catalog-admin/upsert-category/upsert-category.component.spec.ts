import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertCategoryComponent } from './upsert-category.component';

describe('UpsertCategoryComponent', () => {
  let component: UpsertCategoryComponent;
  let fixture: ComponentFixture<UpsertCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpsertCategoryComponent]
    });
    fixture = TestBed.createComponent(UpsertCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
