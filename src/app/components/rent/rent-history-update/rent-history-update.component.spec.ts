import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentHistoryUpdateComponent } from './rent-history-update.component';

describe('RentHistoryUpdateComponent', () => {
  let component: RentHistoryUpdateComponent;
  let fixture: ComponentFixture<RentHistoryUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentHistoryUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentHistoryUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
