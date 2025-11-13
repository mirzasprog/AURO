import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuslovnaRobaComponent } from './neuslovna-roba.component';

describe('NeuslovnaRobaComponent', () => {
  let component: NeuslovnaRobaComponent;
  let fixture: ComponentFixture<NeuslovnaRobaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuslovnaRobaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuslovnaRobaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
