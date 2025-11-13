import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdbijOtpisComponent } from './odbij-otpis.component';

describe('OdbijOtpisComponent', () => {
  let component: OdbijOtpisComponent;
  let fixture: ComponentFixture<OdbijOtpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdbijOtpisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdbijOtpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
