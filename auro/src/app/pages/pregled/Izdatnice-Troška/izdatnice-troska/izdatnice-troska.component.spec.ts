import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IzdatniceTroskaComponent } from './izdatnice-troska.component';

describe('IzdatniceTroskaComponent', () => {
  let component: IzdatniceTroskaComponent;
  let fixture: ComponentFixture<IzdatniceTroskaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IzdatniceTroskaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IzdatniceTroskaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
