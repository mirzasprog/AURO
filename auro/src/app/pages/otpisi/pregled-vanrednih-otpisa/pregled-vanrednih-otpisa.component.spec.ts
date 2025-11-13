import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledVanrednihOtpisaComponent } from './pregled-vanrednih-otpisa.component';

describe('PregledVanrednihOtpisaComponent', () => {
  let component: PregledVanrednihOtpisaComponent;
  let fixture: ComponentFixture<PregledVanrednihOtpisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PregledVanrednihOtpisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PregledVanrednihOtpisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
