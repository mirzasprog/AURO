import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanredniComponent } from './vanredni.component';

describe('VanredniComponent', () => {
  let component: VanredniComponent;
  let fixture: ComponentFixture<VanredniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VanredniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VanredniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
