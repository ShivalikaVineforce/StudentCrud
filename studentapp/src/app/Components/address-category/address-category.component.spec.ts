import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressCategoryComponent } from './address-category.component';

describe('AddressCategoryComponent', () => {
  let component: AddressCategoryComponent;
  let fixture: ComponentFixture<AddressCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
