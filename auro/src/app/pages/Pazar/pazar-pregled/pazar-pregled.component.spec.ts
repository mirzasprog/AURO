import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PazarPregledComponent } from './pazar-pregled.component';

describe('PazarPregledComponent', () => {
  let component: PazarPregledComponent;
  let fixture: ComponentFixture<PazarPregledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PazarPregledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PazarPregledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
