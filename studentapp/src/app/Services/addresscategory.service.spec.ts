import { TestBed } from '@angular/core/testing';

import { AddresscategoryService } from './addresscategory.service';

describe('AddresscategoryService', () => {
  let service: AddresscategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddresscategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
