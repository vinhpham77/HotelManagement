import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPersonBookroomComponent } from './info-person-bookroom.component';

describe('InfoPersonBookroomComponent', () => {
  let component: InfoPersonBookroomComponent;
  let fixture: ComponentFixture<InfoPersonBookroomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPersonBookroomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoPersonBookroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
