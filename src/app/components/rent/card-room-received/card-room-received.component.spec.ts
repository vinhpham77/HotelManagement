import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRoomReceivedComponent } from './card-room-received.component';

describe('CardRoomReceivedComponent', () => {
  let component: CardRoomReceivedComponent;
  let fixture: ComponentFixture<CardRoomReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardRoomReceivedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardRoomReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
