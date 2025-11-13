import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaljiVoComponent } from './detalji-vo.component';

describe('DetaljiVoComponent', () => {
  let component: DetaljiVoComponent;
  let fixture: ComponentFixture<DetaljiVoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetaljiVoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaljiVoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
