import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedovniOtpisComponent } from './redovni-otpis.component';

describe('RedovniOtpisComponent', () => {
  let component: RedovniOtpisComponent;
  let fixture: ComponentFixture<RedovniOtpisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedovniOtpisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedovniOtpisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
