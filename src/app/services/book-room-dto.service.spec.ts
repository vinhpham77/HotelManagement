import { TestBed } from '@angular/core/testing';

import { BookRoomDTOService } from './book-room-dto.service';

describe('BookRoomDTOService', () => {
  let service: BookRoomDTOService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookRoomDTOService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
