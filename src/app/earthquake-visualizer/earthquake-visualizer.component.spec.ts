import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthquakeVisualizerComponent } from './earthquake-visualizer.component';

describe('EarthquakeVisualizerComponent', () => {
  let component: EarthquakeVisualizerComponent;
  let fixture: ComponentFixture<EarthquakeVisualizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarthquakeVisualizerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarthquakeVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
