import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledStavkiComponent } from './pregled-stavki.component';

describe('PregledStavkiComponent', () => {
  let component: PregledStavkiComponent;
  let fixture: ComponentFixture<PregledStavkiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PregledStavkiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PregledStavkiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
