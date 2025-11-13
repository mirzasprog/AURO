import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdbijanjeVanrednogOtpisaComponent } from './odbijanje-vanrednog-otpisa.component';

describe('OdbijanjeVanrednogOtpisaComponent', () => {
  let component: OdbijanjeVanrednogOtpisaComponent;
  let fixture: ComponentFixture<OdbijanjeVanrednogOtpisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdbijanjeVanrednogOtpisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdbijanjeVanrednogOtpisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
