import { TestBed } from '@angular/core/testing';

import { RentroomService } from './rentroom.service';

describe('RentroomService', () => {
  let service: RentroomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RentroomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
