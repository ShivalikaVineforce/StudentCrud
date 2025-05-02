import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { AddressService } from '../../Services/address.service';
import { CountryService } from '../../Services/country.service';
import { StudentClassesService } from '../../Services/student-classes.service';
import { StudentService } from '../../Services/student.service';
import { CommonModule, DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Student, StudentClass, Address, Country, AddressCategory } from '../../Models/student.interface';
import { StudentDetailsDto, StudentSearch } from '../../Models/StudentClassDto.model';
import { Router } from '@angular/router';
import { AddresscategoryService } from '../../Services/addresscategory.service';

import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-student-details',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, CommonModule, HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule], providers: [DatePipe,
      StudentClassesService, AddresscategoryService,
      HttpClient, CountryService, AddressService, StudentService
    ],
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent implements OnInit {
  studentClass: StudentClass = {
    className: '',
    id: 0,
    students: []
  };

  sortColumn: string = ''; formattedDateOfBirth: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  classes: StudentClass[] = []; maxDate = new Date();
  addressCategories: any[] = [];
  selectedClassId: number = 0;
  isEditMode = false;
  selectedaddressCategory: number = 0; today: string = new Date().toISOString().split('T')[0];
  selectedTab: string = 'correspondance';
  student: Student = {
    studentId: 0,
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: new Date(),
    classId: 0,
    class: {
      id: 1,
      className: '',
      students: []
    },
    addresses: [],
  };

  correspondanceAddress: Address = {
    id: 0,
    addressline1: '',
    addressline2: '',
    addressline3: '',
    city: '',
    state: '',
    postalCode: '',
    studentId: 0,
    student: {
      studentId: 0,
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: new Date(),
      classId: 0,
      class: {
        id: 0,
        className: '',
        students: []
      },
      addresses: []
    },
    countryId: 0,
    country: {
      id: 0,
      countryName: '',
      addresses: []
    },
    addressCategoryId: 0,
    addressCategory: {
      id: 0,
      addressCategoryName: '',
      addresses: []
    }
  };
  permanentAddress: Address = {
    id: 0,
    addressline1: '',
    addressline2: '',
    addressline3: '',
    city: '',
    state: '',
    postalCode: '',
    studentId: 0,
    student: {
      studentId: 0,
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: new Date(),
      classId: 0,
      class: {
        id: 0,
        className: '',
        students: []
      },
      addresses: []
    },
    countryId: 0,
    country: {
      id: 0,
      countryName: '',
      addresses: []
    },
    addressCategoryId: 0,
    addressCategory: {
      id: 0,
      addressCategoryName: '',
      addresses: []
    }
  };
  schoolAddress: Address = {
    id: 0,
    addressline1: '',
    addressline2: '',
    addressline3: '',
    city: '',
    state: '',
    postalCode: '',
    studentId: 0,
    student: {
      studentId: 0,
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: new Date(),
      classId: 0,
      class: {
        id: 0,
        className: '',
        students: []
      },
      addresses: []
    },
    countryId: 0,
    country: {
      id: 0,
      countryName: '',
      addresses: []
    },
    addressCategoryId: 0,
    addressCategory: {
      id: 0,
      addressCategoryName: '',
      addresses:
        []
    }
  };
  students: StudentSearch[] = [];
  address: any;
  studentforUpdate!: StudentDetailsDto;
  searchName: string = '';
  searchDOB: string = '';
  searchClass: string = '';
  searchEmail: string = '';
  countries: Country[] = []; isOldAddressExist: boolean = false;
  totalCount = 0;
  totalPages = 0;
  pageSize = 10;
  pageNumber = 1;
  searchTerm = '';
  currentPage = 1;

  addressCategory: AddressCategory = {
    addressCategoryName: '',
    id: 0,
    addresses: []
  };
  constructor(private service: AddresscategoryService, private datePipe: DatePipe, private router: Router, private fb: FormBuilder, private http: HttpClient, private studentClassService: StudentClassesService,
    private studentService: StudentService, private countryService: CountryService, private addressService: AddressService) {

  }
  onSearch(): void {
    this.currentPage = 1;
    this.pageNumber = 1;
    this.loadStudents();
  }
  formatDateForInput(date: Date | string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadStudents();
  }
  goToPage(page: number) {
    this.pageNumber = page;
    this.loadStudents();
  }
  loadStudents(): void {
    debugger;
    this.studentService.getStudents(this.searchTerm, this.pageNumber, this.pageSize, this.sortColumn, this.sortDirection)
      .subscribe(data => {
        this.students = data.students;
        this.totalCount = data.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      });
  }
  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.loadStudents();
    }
  }

  ngOnInit(): void {

    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
    });

    this.loadStudents();
    this.studentClassService.getStudentClasses().subscribe(data => {

      this.classes = data;
    });
    this.addressService.getAddressCategory().subscribe(data => {

      this.addressCategories = data;
    });
  }

  @ViewChild('exampleModal') model: ElementRef | undefined;
  @ViewChild('addressCategoryModal') addressCategoryModal: ElementRef | undefined;
  @ViewChild('classModal') classModal: ElementRef | undefined;
  ismodelshow = signal(false);

  openAddressModel() {
    if (this.addressCategoryModal != null) { this.addressCategoryModal.nativeElement.style.display = 'block'; }
  }
  closeAddressModel(form: NgForm) {
    form.resetForm();
    this.resetAddressCategory();

  }

  openClassModel() {
    if (this.classModal != null) { this.classModal.nativeElement.style.display = 'block'; }
  }
  closeClassModel(form: NgForm) {
    debugger;
    form.resetForm();
    this.resetClasses();
  }
  openModel() {
    this.InitialControl();
    this.isEditMode = false;
    this.ismodelshow = signal(true);
    const serviceModel = document.getElementById('exampleModal');
    if (serviceModel != null) {
      serviceModel.style.display = 'block';
    }
  }
  closeModel() {
    if (this.model != null) { this.model.nativeElement.style.display = 'none'; }
  }
  getTotalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  OnEdit(studentid: any) {
    this.openModel();
    this.isEditMode = true;

    this.studentService.getStudentsForEdit(studentid).subscribe((data) => {
      console.log(data);
      this.student = data[0].student;
      this.formattedDateOfBirth = this.formatDateForInput(this.student.dateOfBirth); // string for input

      // On form submit
      this.student.dateOfBirth = new Date(this.formattedDateOfBirth!);
      let c = data[0].addresses.length;
      for (let address of data[0].addresses) {
        if (address.addressCategoryId == 1) {
          this.correspondanceAddress = address;
        }
        if (address.addressCategoryId == 2)
          this.permanentAddress = address;
        if (address.addressCategoryId == 3)
          this.schoolAddress = address;
      }
      this.selectedClassId = (data[0].student.classId);
    });
  }
  getstudents() {
    this.studentService.getPaginatedStudents(this.pageNumber, this.pageSize)
      .subscribe(data => {
        console.log(data.StudentDto);
        this.students = data.StudentDto;
        this.totalCount = data.TotalCount;

      });
  }
  deleteStudent(studentId: number) {
    this.isEditMode = false;
    const isconfirm = confirm("Are you sure u want to delete student");
    if (isconfirm) {
      this.studentService.deleteStudent(studentId).subscribe({
        next: () => {
          alert("Student deleted successfully");
          this.loadStudents();
        },
        error: (err) => {
          alert("Failed to delete student");
          console.error("Failed to delete student", err);
        }
      });
    }
  }

  @ViewChild('dobInputRef') dobInputElement!: ElementRef;

  async onsubmit(form: NgForm) {
debugger;

    if (!this.formattedDateOfBirth) {
      setTimeout(() => {
        this.dobInputElement.nativeElement.focus();
      }, 0);
      alert('Student Date of birth cannot be empty');
      return;
    }

    this.student.dateOfBirth = new Date(this.formattedDateOfBirth!);   
    this.student.classId = Number(this.selectedClassId);
    this.student.addresses = [];

    if (this.correspondanceAddress && Number(this.correspondanceAddress.countryId) !== 0) {
      this.correspondanceAddress.countryId = Number(this.correspondanceAddress.countryId);
      this.correspondanceAddress.addressCategoryId = 1;
      this.student.addresses.push(this.correspondanceAddress);
    }
   

    if (this.permanentAddress && Number(this.permanentAddress.countryId) !== 0) {
      this.permanentAddress.countryId = Number(this.permanentAddress.countryId);
      this.permanentAddress.addressCategoryId = 2;
      this.student.addresses.push(this.permanentAddress);
    }

    if (this.schoolAddress && Number(this.schoolAddress.countryId) !== 0) {
      this.schoolAddress.countryId = Number(this.schoolAddress.countryId);
      this.schoolAddress.addressCategoryId = 2;
      this.student.addresses.push(this.schoolAddress);
    }

    const nonEmptyAddresses = this.student.addresses.filter(addr => !this.isAddressEmpty(addr));

    if (nonEmptyAddresses.length === 0) {
      alert('Please enter at least one valid address.');
      return;
    }

    try {
      if (this.isEditMode) {
        await firstValueFrom(this.studentService.updateStudent(this.student));
        alert('Student updated successfully');
      } else {
        await firstValueFrom(this.studentService.addStudent(this.student));
        alert('Student created successfully');
      }

      const closeBtn = document.getElementById('closeStudentBtn');
      if (closeBtn) closeBtn.click();
      this.InitialControl();
      this.sortDirection = 'desc';
      this.loadStudents();

    }
    catch (error: any) {
      this.handleApiError(error, this.isEditMode ? 'Error updating student' : 'Error creating student');
      const backendMessage = error?.error?.message || 'Something went wrong. Please try again.';      
      console.error(error);
    }
  }

  isAddressEmpty(addr: any): boolean {
    return !addr.line1 && !addr.line2 && !addr.city && !addr.state && !addr.country && !addr.postalCode;
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.loadStudents();
    this.students.sort((a: any, b: any) => {
      const valueA = a[column]?.toString().toLowerCase() || '';
      const valueB = b[column]?.toString().toLowerCase() || '';

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }
  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'bi bi-arrow-down-up';
    return this.sortDirection === 'asc' ? 'bi bi-arrow-down' : 'bi bi-arrow-up';
  }

  InitialControl() {
    this.selectedClassId = 0;
    this.searchTerm = '';

    this.formattedDateOfBirth = '';
    this.student = {
      studentId: 0,
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: null,
      classId: 0,
      class: {
        id: 1,
        className: '',
        students: []
      },
      addresses: [],
    };
  }

  AddAddressCategory() {
    try {
      this.service.AddAddressCategories(this.addressCategory).subscribe({
        next: (res) => {
          console.log('address Category created:', res);
          alert('Address Category added successfully!');
          this.resetAddressCategory(); // reset
        },
        error: (err) => {
          console.error('API error:', err);
          let userMessage = 'Something went wrong. Please try again.';
          if (err.status === 400 || err.status === 500) {
            userMessage = err.error?.message || userMessage;
          }
          alert(`Failed to Add Address Category: ${userMessage}`);
        },
      });

    } catch (error: any) {
      debugger;
      this.handleApiError(error, 'Error creating Address Category');
      const backendMessage = error?.error?.message || 'Something went wrong. Please try again.';
    }
  }
  isMyClassAdded = false;
  AddClasses() {
    this.studentClassService.createClass(this.studentClass).subscribe({
      next: (res) => {
        alert('Class added successfully!');
       
        this.resetClasses(); 
      },
      error: (err) => {

        let studentClassMessage = 'Something went wrong. Please try again.';
        if (err.status === 400 || err.status === 500) {
          studentClassMessage = err.error?.message || studentClassMessage;
        }
        alert(`Failed to Add Student Class : ${studentClassMessage}`);
      },
    });
    const closeBtn = document.getElementById('closeClassBtn');
    if (closeBtn) closeBtn.click();
    this.resetClasses();
  }
  resetAddressCategory() {
    this.addressCategory = {
      addressCategoryName: '',
      id: 0,
      addresses: []
    };
  }
  resetClasses() {
    this.studentClass = {
      className: '',
      id: 0,
      students: []
    };
  }

  isFutureDate(dateString: string | null | undefined): boolean {
    if (!dateString) return false;
    const selectedDate = new Date(dateString);
    const today = new Date();

    // Strip time for accurate comparison
    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selectedDate > today;
  }


  handleApiError(error: any, fallbackMessage: string) {
    const message = error?.error?.message || fallbackMessage;
    alert(message);
    console.error('API Error:', error);
  }

  dobError: string | null = null; invalidDate = false;
  validateDateOfBirth(value: string) {
    this.dobError = null;

    if (!this.formattedDateOfBirth) return;

    const year = new Date(value).getFullYear();
    this.invalidDate = year < 1900;
    if (this.invalidDate) {
      this.formattedDateOfBirth = ''; // optional: reset invalid date
    }
    // Check for special characters (allow only YYYY-MM-DD or similar digits and hyphens)
    const datePattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
    if (!datePattern.test(this.formattedDateOfBirth)) {
      this.dobError = 'invalidChars';
      return;
    }

    const inputDate = new Date(this.formattedDateOfBirth);
    const today = new Date();

    if (inputDate > today) {
      this.dobError = 'future';
    }
  }
}

