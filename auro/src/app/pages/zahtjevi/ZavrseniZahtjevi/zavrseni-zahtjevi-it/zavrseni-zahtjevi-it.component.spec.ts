import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZavrseniZahtjeviItComponent } from './zavrseni-zahtjevi-it.component';

describe('ZavrseniZahtjeviItComponent', () => {
  let component: ZavrseniZahtjeviItComponent;
  let fixture: ComponentFixture<ZavrseniZahtjeviItComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZavrseniZahtjeviItComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZavrseniZahtjeviItComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
