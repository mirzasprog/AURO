import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatumInvComponent } from './datum-inv.component';

describe('DatumInvComponent', () => {
  let component: DatumInvComponent;
  let fixture: ComponentFixture<DatumInvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatumInvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatumInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
