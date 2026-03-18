import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PazarUnosComponent } from './pazar-unos.component';

describe('PazarUnosComponent', () => {
  let component: PazarUnosComponent;
  let fixture: ComponentFixture<PazarUnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PazarUnosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PazarUnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
