import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentChangeRoomComponent } from './rent-change-room.component';

describe('RentChangeRoomComponent', () => {
  let component: RentChangeRoomComponent;
  let fixture: ComponentFixture<RentChangeRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentChangeRoomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentChangeRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
