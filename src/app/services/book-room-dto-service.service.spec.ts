import { TestBed } from '@angular/core/testing';

import { BookRoomDtoServiceService } from './book-room-dto-service.service';

describe('BookRoomDtoServiceService', () => {
  let service: BookRoomDtoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookRoomDtoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
