import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KomentarOdbijanjaComponent } from './komentar-odbijanja.component';

describe('KomentarOdbijanjaComponent', () => {
  let component: KomentarOdbijanjaComponent;
  let fixture: ComponentFixture<KomentarOdbijanjaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KomentarOdbijanjaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KomentarOdbijanjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
