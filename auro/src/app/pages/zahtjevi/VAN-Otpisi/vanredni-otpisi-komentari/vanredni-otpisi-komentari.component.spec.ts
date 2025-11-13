import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanredniOtpisiKomentariComponent } from './vanredni-otpisi-komentari.component';

describe('VanredniOtpisiKomentariComponent', () => {
  let component: VanredniOtpisiKomentariComponent;
  let fixture: ComponentFixture<VanredniOtpisiKomentariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VanredniOtpisiKomentariComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VanredniOtpisiKomentariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
