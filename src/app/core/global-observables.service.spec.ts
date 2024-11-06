import { TestBed } from '@angular/core/testing';

import { GlobalObservablesService } from './global-observables.service';

describe('GlobalObservablesService', () => {
  let service: GlobalObservablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalObservablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
