import { TestBed } from '@angular/core/testing';

import { ReservationDetailService } from './reservation-detail.service';

describe('ReservationDetailService', () => {
  let service: ReservationDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReservationDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
