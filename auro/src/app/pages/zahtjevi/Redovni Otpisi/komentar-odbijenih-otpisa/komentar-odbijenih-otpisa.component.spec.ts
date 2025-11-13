import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KomentarOdbijenihOtpisaComponent } from './komentar-odbijenih-otpisa.component';

describe('KomentarOdbijenihOtpisaComponent', () => {
  let component: KomentarOdbijenihOtpisaComponent;
  let fixture: ComponentFixture<KomentarOdbijenihOtpisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KomentarOdbijenihOtpisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KomentarOdbijenihOtpisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
