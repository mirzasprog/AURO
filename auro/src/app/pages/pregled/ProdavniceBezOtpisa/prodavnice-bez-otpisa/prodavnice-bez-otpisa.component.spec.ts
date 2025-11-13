import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdavniceBezOtpisaComponent } from './prodavnice-bez-otpisa.component';

describe('ProdavniceBezOtpisaComponent', () => {
  let component: ProdavniceBezOtpisaComponent;
  let fixture: ComponentFixture<ProdavniceBezOtpisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdavniceBezOtpisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdavniceBezOtpisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
