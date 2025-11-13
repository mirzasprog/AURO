import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdbijeniArtikliROComponent } from './odbijeni-artikli-ro.component';

describe('OdbijeniArtikliROComponent', () => {
  let component: OdbijeniArtikliROComponent;
  let fixture: ComponentFixture<OdbijeniArtikliROComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdbijeniArtikliROComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdbijeniArtikliROComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
