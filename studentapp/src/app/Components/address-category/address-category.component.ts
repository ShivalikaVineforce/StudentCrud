import { Component } from '@angular/core';
import { AddressCategory, StudentClass } from '../../Models/student.interface';
import { StudentClassesService } from '../../Services/student-classes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AddresscategoryService } from '../../Services/addresscategory.service';

@Component({
  selector: 'app-address-category',
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [HttpClient, AddresscategoryService],
  templateUrl: './address-category.component.html',
  styleUrl: './address-category.component.css'
})
export class AddressCategoryComponent {

  addressCategory: AddressCategory = {
    addressCategoryName: '',
    id: 0,
    addresses: []
};
showForm: boolean = true;

constructor(private router: Router,private service: AddresscategoryService) {}

submit() {
  this.service.AddAddressCategories(this.addressCategory).subscribe({
    next: (res) => {
      console.log('Address Category created:', res);
      alert('Address Category added successfully!');
      this.cancel (); // reset
    },
    error: (err) => {
      console.error('Error:', err);
      alert('Failed to save Address Category.');
    },
  });
}cancel() {
  this.showForm = false;
  this.router.navigate(['/student-details']);
  this.addressCategory= {
    addressCategoryName: '',
    id: 0,
    addresses: []
};
  }
}


