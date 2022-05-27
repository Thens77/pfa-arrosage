import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartZComponent } from './chart-z.component';

describe('ChartZComponent', () => {
  let component: ChartZComponent;
  let fixture: ComponentFixture<ChartZComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartZComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartZComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
