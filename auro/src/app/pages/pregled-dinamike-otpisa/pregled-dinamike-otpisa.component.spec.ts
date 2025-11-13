import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledDinamikeOtpisaComponent } from './pregled-dinamike-otpisa.component';

describe('PregledDinamikeOtpisaComponent', () => {
  let component: PregledDinamikeOtpisaComponent;
  let fixture: ComponentFixture<PregledDinamikeOtpisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PregledDinamikeOtpisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PregledDinamikeOtpisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
