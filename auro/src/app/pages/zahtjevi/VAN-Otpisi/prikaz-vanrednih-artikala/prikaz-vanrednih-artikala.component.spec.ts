import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrikazVanrednihArtikalaComponent } from './prikaz-vanrednih-artikala.component';

describe('PrikazVanrednihArtikalaComponent', () => {
  let component: PrikazVanrednihArtikalaComponent;
  let fixture: ComponentFixture<PrikazVanrednihArtikalaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrikazVanrednihArtikalaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrikazVanrednihArtikalaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
