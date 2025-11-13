import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanredniOtpisComponent } from './vanredni-otpis.component';

describe('VanredniOtpisComponent', () => {
  let component: VanredniOtpisComponent;
  let fixture: ComponentFixture<VanredniOtpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VanredniOtpisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VanredniOtpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
