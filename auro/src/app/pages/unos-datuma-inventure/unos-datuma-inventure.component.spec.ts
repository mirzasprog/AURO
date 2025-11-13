import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnosDatumaInventureComponent } from './unos-datuma-inventure.component';

describe('UnosDatumaInventureComponent', () => {
  let component: UnosDatumaInventureComponent;
  let fixture: ComponentFixture<UnosDatumaInventureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnosDatumaInventureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnosDatumaInventureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
