import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AkcijeStavkePregledComponent } from './akcije-stavke-pregled.component';

describe('AkcijeStavkePregledComponent', () => {
  let component: AkcijeStavkePregledComponent;
  let fixture: ComponentFixture<AkcijeStavkePregledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AkcijeStavkePregledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AkcijeStavkePregledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
