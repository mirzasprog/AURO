import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VikendAkcijeProdavniceViewComponent } from './vikend-akcije-prodavnice-view.component';

describe('VikendAkcijeProdavniceViewComponent', () => {
  let component: VikendAkcijeProdavniceViewComponent;
  let fixture: ComponentFixture<VikendAkcijeProdavniceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VikendAkcijeProdavniceViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VikendAkcijeProdavniceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
