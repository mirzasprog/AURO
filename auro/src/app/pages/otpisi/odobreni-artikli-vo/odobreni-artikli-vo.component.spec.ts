import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OdobreniArtikliVOComponent } from './odobreni-artikli-vo.component';

describe('OdobreniArtikliVOComponent', () => {
  let component: OdobreniArtikliVOComponent;
  let fixture: ComponentFixture<OdobreniArtikliVOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OdobreniArtikliVOComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OdobreniArtikliVOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
