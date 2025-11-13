import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtikliVanredniComponent } from './artikli-vanredni.component';

describe('ArtikliVanredniComponent', () => {
  let component: ArtikliVanredniComponent;
  let fixture: ComponentFixture<ArtikliVanredniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArtikliVanredniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtikliVanredniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
