import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkerDetailsModalComponent } from './marker-details-modal.component';

describe('MarkerDetailsModalComponent', () => {
  let component: MarkerDetailsModalComponent;
  let fixture: ComponentFixture<MarkerDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkerDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkerDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
