import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AkcijeStavkeComponent } from './akcije-stavke.component';

describe('AkcijeStavkeComponent', () => {
  let component: AkcijeStavkeComponent;
  let fixture: ComponentFixture<AkcijeStavkeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AkcijeStavkeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AkcijeStavkeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
