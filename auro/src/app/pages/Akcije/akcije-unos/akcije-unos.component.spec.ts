import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AkcijeUnosComponent } from './akcije-unos.component';

describe('AkcijeUnosComponent', () => {
  let component: AkcijeUnosComponent;
  let fixture: ComponentFixture<AkcijeUnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AkcijeUnosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AkcijeUnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
