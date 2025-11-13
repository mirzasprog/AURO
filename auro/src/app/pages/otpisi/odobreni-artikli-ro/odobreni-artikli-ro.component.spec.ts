import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdobreniArtikliROComponent } from './odobreni-artikli-ro.component';

describe('OdobreniArtikliROComponent', () => {
  let component: OdobreniArtikliROComponent;
  let fixture: ComponentFixture<OdobreniArtikliROComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdobreniArtikliROComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdobreniArtikliROComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
