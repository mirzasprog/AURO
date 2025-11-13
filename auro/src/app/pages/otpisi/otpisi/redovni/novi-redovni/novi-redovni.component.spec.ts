import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoviRedovniComponent } from './novi-redovni.component';

describe('NoviRedovniComponent', () => {
  let component: NoviRedovniComponent;
  let fixture: ComponentFixture<NoviRedovniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoviRedovniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoviRedovniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should createed', () => {
    expect(component).toBeTruthy();
  });
});
