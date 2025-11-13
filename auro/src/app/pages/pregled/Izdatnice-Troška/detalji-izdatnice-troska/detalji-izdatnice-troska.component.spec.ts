import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetaljiIzdatniceTroskaComponent } from './detalji-izdatnice-troska.component';

describe('DetaljiIzdatniceTroskaComponent', () => {
  let component: DetaljiIzdatniceTroskaComponent;
  let fixture: ComponentFixture<DetaljiIzdatniceTroskaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetaljiIzdatniceTroskaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetaljiIzdatniceTroskaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
