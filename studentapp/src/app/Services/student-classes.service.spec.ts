import { TestBed } from '@angular/core/testing';

import { StudentClassesService } from './student-classes.service';

describe('StudentClassesService', () => {
  let service: StudentClassesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentClassesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
