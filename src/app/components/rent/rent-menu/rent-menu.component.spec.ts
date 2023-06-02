import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentMenuComponent } from './rent-menu.component';

describe('RentMenuComponent', () => {
  let component: RentMenuComponent;
  let fixture: ComponentFixture<RentMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
