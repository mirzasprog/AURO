import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedovniOtpisPregledComponent } from './redovni-otpis-pregled.component';

describe('RedovniOtpisPregledComponent', () => {
  let component: RedovniOtpisPregledComponent;
  let fixture: ComponentFixture<RedovniOtpisPregledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedovniOtpisPregledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedovniOtpisPregledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
