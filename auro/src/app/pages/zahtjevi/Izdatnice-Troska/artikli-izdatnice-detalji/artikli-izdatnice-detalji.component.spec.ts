import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtikliIzdatniceDetaljiComponent } from './artikli-izdatnice-detalji.component';

describe('ArtikliIzdatniceDetaljiComponent', () => {
  let component: ArtikliIzdatniceDetaljiComponent;
  let fixture: ComponentFixture<ArtikliIzdatniceDetaljiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtikliIzdatniceDetaljiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtikliIzdatniceDetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
