import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReklamacijeKvalitetaVIPComponent } from './reklamacije-kvaliteta-vip.component';

describe('ReklamacijeKvalitetaVIPComponent', () => {
  let component: ReklamacijeKvalitetaVIPComponent;
  let fixture: ComponentFixture<ReklamacijeKvalitetaVIPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReklamacijeKvalitetaVIPComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReklamacijeKvalitetaVIPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
