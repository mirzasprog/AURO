import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdbijeniArtikliVOComponent } from './odbijeni-artikli-vo.component';

describe('OdbijeniArtikliVOComponent', () => {
  let component: OdbijeniArtikliVOComponent;
  let fixture: ComponentFixture<OdbijeniArtikliVOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdbijeniArtikliVOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdbijeniArtikliVOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
