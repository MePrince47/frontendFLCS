import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenFinal } from './examen-final';

describe('ExamenFinal', () => {
  let component: ExamenFinal;
  let fixture: ComponentFixture<ExamenFinal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamenFinal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamenFinal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
