import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcijalneInvComponent } from './parcijalne-inv.component';

describe('ParcijalneInvComponent', () => {
  let component: ParcijalneInvComponent;
  let fixture: ComponentFixture<ParcijalneInvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParcijalneInvComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParcijalneInvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
