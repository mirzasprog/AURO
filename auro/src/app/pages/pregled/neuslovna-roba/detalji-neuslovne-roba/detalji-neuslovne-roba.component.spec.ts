import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaljiNeuslovneRobaComponent } from './detalji-neuslovne-roba.component';

describe('DetaljiNeuslovneRobaComponent', () => {
  let component: DetaljiNeuslovneRobaComponent;
  let fixture: ComponentFixture<DetaljiNeuslovneRobaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetaljiNeuslovneRobaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaljiNeuslovneRobaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
