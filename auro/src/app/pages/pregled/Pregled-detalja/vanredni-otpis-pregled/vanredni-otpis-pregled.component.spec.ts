import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanredniOtpisPregledComponent } from './vanredni-otpis-pregled.component';

describe('VanredniOtpisPregledComponent', () => {
  let component: VanredniOtpisPregledComponent;
  let fixture: ComponentFixture<VanredniOtpisPregledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VanredniOtpisPregledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VanredniOtpisPregledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
