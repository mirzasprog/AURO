import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtikliDetaljiPregledComponent } from './artikli-detalji-pregled.component';

describe('ArtikliDetaljiPregledComponent', () => {
  let component: ArtikliDetaljiPregledComponent;
  let fixture: ComponentFixture<ArtikliDetaljiPregledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtikliDetaljiPregledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtikliDetaljiPregledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
