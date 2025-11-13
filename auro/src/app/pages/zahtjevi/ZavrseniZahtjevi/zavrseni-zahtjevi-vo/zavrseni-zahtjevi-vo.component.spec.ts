import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZavrseniZahtjeviVoComponent } from './zavrseni-zahtjevi-vo.component';

describe('ZavrseniZahtjeviVoComponent', () => {
  let component: ZavrseniZahtjeviVoComponent;
  let fixture: ComponentFixture<ZavrseniZahtjeviVoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZavrseniZahtjeviVoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZavrseniZahtjeviVoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
