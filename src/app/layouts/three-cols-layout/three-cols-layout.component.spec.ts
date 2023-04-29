import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeColsLayoutComponent } from './three-cols-layout.component';

describe('ThreeColsLayoutComponent', () => {
  let component: ThreeColsLayoutComponent;
  let fixture: ComponentFixture<ThreeColsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreeColsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreeColsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
