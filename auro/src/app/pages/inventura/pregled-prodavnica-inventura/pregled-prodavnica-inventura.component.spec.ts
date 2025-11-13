import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregledProdavnicaInventuraComponent } from './pregled-prodavnica-inventura.component';

describe('PregledProdavnicaInventuraComponent', () => {
  let component: PregledProdavnicaInventuraComponent;
  let fixture: ComponentFixture<PregledProdavnicaInventuraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PregledProdavnicaInventuraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PregledProdavnicaInventuraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
