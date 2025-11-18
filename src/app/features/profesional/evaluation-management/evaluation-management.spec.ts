import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationManagement } from './evaluation-management';

describe('EvaluationManagement', () => {
  let component: EvaluationManagement;
  let fixture: ComponentFixture<EvaluationManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EvaluationManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvaluationManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
