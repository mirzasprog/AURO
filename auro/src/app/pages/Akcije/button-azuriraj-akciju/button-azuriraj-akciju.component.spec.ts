import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonAzurirajAkcijuComponent } from './button-azuriraj-akciju.component';

describe('ButtonAzurirajAkcijuComponent', () => {
  let component: ButtonAzurirajAkcijuComponent;
  let fixture: ComponentFixture<ButtonAzurirajAkcijuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonAzurirajAkcijuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonAzurirajAkcijuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
