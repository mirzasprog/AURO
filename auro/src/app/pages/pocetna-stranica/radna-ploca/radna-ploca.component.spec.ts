import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadnaPlocaComponent } from './radna-ploca.component';

describe('RadnaPlocaComponent', () => {
  let component: RadnaPlocaComponent;
  let fixture: ComponentFixture<RadnaPlocaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RadnaPlocaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RadnaPlocaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
