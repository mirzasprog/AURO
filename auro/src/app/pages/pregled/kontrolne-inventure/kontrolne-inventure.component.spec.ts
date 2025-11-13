import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KontrolneInventureComponent } from './kontrolne-inventure.component';

describe('KontrolneInventureComponent', () => {
  let component: KontrolneInventureComponent;
  let fixture: ComponentFixture<KontrolneInventureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KontrolneInventureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KontrolneInventureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
