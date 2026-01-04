import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDetails } from './candidate-details';

describe('CandidateDetails', () => {
  let component: CandidateDetails;
  let fixture: ComponentFixture<CandidateDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
