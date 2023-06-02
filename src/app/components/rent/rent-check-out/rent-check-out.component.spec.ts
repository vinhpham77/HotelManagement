import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentCheckOutComponent } from './rent-check-out.component';

describe('RentCheckOutComponent', () => {
  let component: RentCheckOutComponent;
  let fixture: ComponentFixture<RentCheckOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentCheckOutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentCheckOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
