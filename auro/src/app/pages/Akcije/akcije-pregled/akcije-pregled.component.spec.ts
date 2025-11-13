import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AkcijePregledComponent } from './akcije-pregled.component';

describe('AkcijePregledComponent', () => {
  let component: AkcijePregledComponent;
  let fixture: ComponentFixture<AkcijePregledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AkcijePregledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AkcijePregledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
