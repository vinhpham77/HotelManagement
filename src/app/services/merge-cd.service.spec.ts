import { TestBed } from '@angular/core/testing';

import { MergeCDService } from './merge-cd.service';

describe('MergeCDService', () => {
  let service: MergeCDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MergeCDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
