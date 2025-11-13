import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DinamikaRedovnihOtpisaComponent } from './dinamika-redovnih-otpisa.component';

describe('DinamikaRedovnihOtpisaComponent', () => {
  let component: DinamikaRedovnihOtpisaComponent;
  let fixture: ComponentFixture<DinamikaRedovnihOtpisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DinamikaRedovnihOtpisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DinamikaRedovnihOtpisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
