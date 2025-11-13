import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZahtjeviVanredniOtpisiComponent } from './zahtjevi-vanredni-otpisi.component';

describe('ZahtjeviVanredniOtpisiComponent', () => {
  let component: ZahtjeviVanredniOtpisiComponent;
  let fixture: ComponentFixture<ZahtjeviVanredniOtpisiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZahtjeviVanredniOtpisiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZahtjeviVanredniOtpisiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
