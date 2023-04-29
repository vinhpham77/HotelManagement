import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoColsLayoutComponent } from './two-cols-layout.component';

describe('TwoColsLayoutComponent', () => {
  let component: TwoColsLayoutComponent;
  let fixture: ComponentFixture<TwoColsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TwoColsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoColsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
