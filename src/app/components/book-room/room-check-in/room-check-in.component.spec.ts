import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomCheckInComponent } from './room-check-in.component';

describe('RoomCheckInComponent', () => {
  let component: RoomCheckInComponent;
  let fixture: ComponentFixture<RoomCheckInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoomCheckInComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
