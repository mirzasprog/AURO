import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledInventureComponent } from './pregled-inventure.component';

describe('PregledInventureComponent', () => {
  let component: PregledInventureComponent;
  let fixture: ComponentFixture<PregledInventureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PregledInventureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PregledInventureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
