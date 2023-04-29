import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MangerItemComponent } from './manger-item.component';

describe('MangerItemComponent', () => {
  let component: MangerItemComponent;
  let fixture: ComponentFixture<MangerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MangerItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MangerItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
