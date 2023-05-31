import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuMenuItemComponent } from './cu-menu-item.component';

describe('CuMenuItemComponent', () => {
  let component: CuMenuItemComponent;
  let fixture: ComponentFixture<CuMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuMenuItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
