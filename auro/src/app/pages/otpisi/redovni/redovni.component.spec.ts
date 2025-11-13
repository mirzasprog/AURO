import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedovniComponent } from './redovni.component';

describe('RedovniComponent', () => {
  let component: RedovniComponent;
  let fixture: ComponentFixture<RedovniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedovniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedovniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
