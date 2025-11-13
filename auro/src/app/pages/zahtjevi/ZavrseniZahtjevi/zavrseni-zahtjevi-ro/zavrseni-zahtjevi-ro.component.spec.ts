import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZavrseniZahtjeviRoComponent } from './zavrseni-zahtjevi-ro.component';

describe('ZavrseniZahtjeviRoComponent', () => {
  let component: ZavrseniZahtjeviRoComponent;
  let fixture: ComponentFixture<ZavrseniZahtjeviRoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZavrseniZahtjeviRoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZavrseniZahtjeviRoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
