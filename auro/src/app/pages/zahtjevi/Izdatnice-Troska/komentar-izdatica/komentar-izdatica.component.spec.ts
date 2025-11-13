import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KomentarIzdaticaComponent } from './komentar-izdatica.component';

describe('KomentarIzdaticaComponent', () => {
  let component: KomentarIzdaticaComponent;
  let fixture: ComponentFixture<KomentarIzdaticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KomentarIzdaticaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KomentarIzdaticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
