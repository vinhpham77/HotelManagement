import { TestBed } from '@angular/core/testing';

import { componentService } from './component.service';

describe('DynamicComponentService', () => {
  let service: componentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(componentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
