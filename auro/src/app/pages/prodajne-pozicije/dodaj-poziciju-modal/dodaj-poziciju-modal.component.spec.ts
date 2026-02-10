import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodajPozicijuModalComponent } from './dodaj-poziciju-modal.component';

describe('DodajPozicijuModalComponent', () => {
  let component: DodajPozicijuModalComponent;
  let fixture: ComponentFixture<DodajPozicijuModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DodajPozicijuModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DodajPozicijuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
