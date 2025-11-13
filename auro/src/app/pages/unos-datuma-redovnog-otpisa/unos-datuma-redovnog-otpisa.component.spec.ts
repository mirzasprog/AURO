import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnosDatumaRedovnogOtpisaComponent } from './unos-datuma-redovnog-otpisa.component';

describe('UnosDatumaRedovnogOtpisaComponent', () => {
  let component: UnosDatumaRedovnogOtpisaComponent;
  let fixture: ComponentFixture<UnosDatumaRedovnogOtpisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnosDatumaRedovnogOtpisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnosDatumaRedovnogOtpisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
