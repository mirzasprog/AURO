import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NemaOtpisaComponent } from './nema-otpisa.component';

describe('NemaOtpisaComponent', () => {
  let component: NemaOtpisaComponent;
  let fixture: ComponentFixture<NemaOtpisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NemaOtpisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NemaOtpisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
