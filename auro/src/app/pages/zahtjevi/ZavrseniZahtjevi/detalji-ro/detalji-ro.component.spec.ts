import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaljiRoComponent } from './detalji-ro.component';

describe('DetaljiRoComponent', () => {
  let component: DetaljiRoComponent;
  let fixture: ComponentFixture<DetaljiRoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetaljiRoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaljiRoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
