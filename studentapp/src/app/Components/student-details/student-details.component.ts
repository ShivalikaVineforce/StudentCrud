import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { AddressService } from '../../Services/address.service';
import { CountryService } from '../../Services/country.service';
import { StudentClassesService } from '../../Services/student-classes.service';
import { StudentService } from '../../Services/student.service';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Student, StudentClass, StudentDto, Address, Country } from '../../Models/student.interface';
import { StudentDetailsDto } from '../../Models/StudentClassDto.model';

@Component({
    selector: 'app-student-details',
    imports: [FormsModule, CommonModule, ReactiveFormsModule, CommonModule, HttpClientModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule], providers: [
        StudentClassesService,
        HttpClient, CountryService, AddressService, StudentService
    ],
    templateUrl: './student-details.component.html',
    styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent implements OnInit {
  classes: StudentClass[] = []; maxDate = new Date();
  addressCategories: any[] = [];
  selectedClassId: number = 0;
  studentForm: FormGroup; isEditMode = false;
  selectedaddressCategory: number = 0;
  selectedTab: string = 'correspondance';
  student: Student = {
    studentId: 0,
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    classId: 0,
    class: {
      id: 1,
      className: '',
      students: []
    },
    addresses: [],
  };
  studentdb: StudentDto = new StudentDto();
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
      dateOfBirth: '',
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
      dateOfBirth: '',
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
      dateOfBirth: '',
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
  //students:StudentDetailsDto[]=[];
  students: Student[] = [];
  address: any;
  studentforUpdate!: StudentDetailsDto;

  searchName: string = '';
  searchDOB: string = '';
  searchClass: string = '';
  searchEmail: string = '';


  countries: Country[] = []; isOldAddressExist: boolean = false;
  totalCount = 0;
  totalPages=0;
  pageSize = 10; // Number of items per page
  pageNumber = 1;

  searchTerm = '';
  currentPage = 1;
  

  constructor(private fb: FormBuilder, private http: HttpClient, private studentClassService: StudentClassesService,
    private studentService: StudentService, private countryService: CountryService, private addressService: AddressService) {
    this.studentForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      dateOfBirth: new FormControl<Date | null>(null),
      classId: [0],
      addresses: this.fb.array([this.createAddressFormGroup()])

      // add your controls here
    });
  }
  onSearch(): void {
    this.currentPage = 1;
    this.pageNumber = 1;
    this.loadStudents();
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
    this.studentService.getStudents(this.searchName, this.searchEmail, this.pageNumber, this.pageSize)
      .subscribe(data => {
        debugger;
       
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
    this.setFormState();
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
    });
    //this.getAllStudents();
    this.loadStudents();
   

    // Fetch available classes and address categories from the backend
    this.studentClassService.getStudentClasses().subscribe(data => {

      this.classes = data;
    });
    this.addressService.getAddressCategory().subscribe(data => {

      this.addressCategories = data;
    });
    // this.addressCategories$ = this.http.get<any[]>('/api/addresscategories');
  } 
  // getAllStudents() {
  //   this.studentService.getStudents().subscribe((data) => {


  //     this.students = data;
  //     console.log(data);
  //     this.setFormState();
  //   });
  // }
  @ViewChild('exampleModal') model: ElementRef | undefined;
  ismodelshow = signal(false);
  openModel() {
    this.student={
      studentId: 0,
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      classId: 0,
      class: {
        id: 1,
        className: '',
        students: []
      },
      addresses: [],
    };;
    this.isEditMode = false;
  
    this.ismodelshow = signal(true);
    const serviceModel = document.getElementById('exampleModal');
    if (serviceModel != null) {

      serviceModel.style.display = 'block';
    }
  }
  closeModel() {
    this.setFormState();
    if (this.model != null) { this.model.nativeElement.style.display = 'none'; }

  }
  getTotalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  OnEdit(studentid: any) {
    //console.log (student);
    this.openModel();
    this.isEditMode = true;
   
    this.studentService.getStudentsForEdit(studentid).subscribe((data) => {
     
      console.log(data);
      this.student = data[0].student;
      let c = data[0].addresses.length;
      for (let address of data[0].addresses) {
        if (address.addressCategoryId == 1) {
          this.correspondanceAddress = address;
          //this.correspondanceAddress.
        }
        if (address.addressCategoryId == 2)
          this.permanentAddress = address;
        if (address.addressCategoryId == 3)
          this.schoolAddress = address;

      }

      this.selectedClassId = (data[0].student.classId);
      console.log(data);
      this.setFormState();
    });

  }
  // onCountryIdChange(value: any) {
  //   //if(type=='correspondance')
  //   // this.schoolAddress.countryId = parseInt(value, 10);
  //   //this.permanentAddress.countryId = parseInt(value, 10);
    
  //   this.correspondanceAddress.countryId = parseInt(value, 10);
  // }


  setFormState() {
    //this.isEditMode=false;
    this.correspondanceAddress.addressCategoryId = 1;
    this.permanentAddress.addressCategoryId = 2;
    this.schoolAddress.addressCategoryId = 3;
    this.studentForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: new FormControl<Date | null>(null),
      classId: [0, Validators.required],
      addresses: this.fb.array([this.createAddressFormGroup()]) // Address FormArray
    });
  }
  onaddressCategorySelect(id: string, isChecked: boolean): void {
    
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }
  // addAddress(addressType: string) {

  //   const newAddress :Address= {
  //     id: 0,
  //     city: '',
  //     addressline1: '',
  //     addressline2: '',
  //     addressline3: '',
  //     state: '',
  //     postalCode: '',
  //     studentId: 0,
  //     student: '',
  //     countryId: 0,
  //     country: Country{
  //       id= 0,
  // name= '',
  // addresses= [''],
  //     },
  //     addressCategoryId: 0,
  //     addressCategory: AddressCategory
  //   };
  //   if(addressType=="correspondance")
  //   newAddress.addressCategoryId = 1;
  //   else if(addressType=="permanent")
  //     newAddress.addressCategoryId = 2;
  //   else if(addressType=="school")
  //     newAddress.addressCategoryId = 3;
  //   if (addressType === 'correspondance') {
  //     this.address.addressCategoryId= 1;
  //   } else if (addressType === 'permanent') {
  //     this.address.addressCategoryId= 2;
  //   } else if (addressType === 'school') {
  //     this.address.addressCategoryId= 3;
  //   } 

  //   this.isOldAddressExist = true;
  //   this.student.address.push({ ...this.address }); // Add current package to the shipment's packages array
  //   this.address : Address; // Reset the package input fields

  // }


  onAddressCategoryChange(event: Event): void { }
 
  getstudents() {
    this.studentService.getPaginatedStudents(this.pageNumber, this.pageSize)
      .subscribe(data => {
        console.log(data.StudentDto);
        this.students = data.StudentDto;
        this.totalCount = data.TotalCount;

      });

    this.setFormState();

  }
  // Helper to create a new address form group
  createAddressFormGroup(): FormGroup {
    return this.fb.group({
      addressline1: ['', Validators.required],
      addressline2: [''],
      addressline3: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      addressCategoryId: [null, Validators.required],
      dateofBirth: ['', Validators.required],
      postalCode: ['', Validators.required],
      email: ['', Validators.required]

    });
  }

  // Getter for the address array
  get addresses(): FormArray {
    return this.studentForm.get('addresses') as FormArray;
  }
  deleteStudent(studentId: number) {
    this.isEditMode=false;
    const isconfirm = confirm("Are you sure u want to delete the service");
    if (isconfirm) {
    this.studentService.deleteStudent(studentId).subscribe({
      next: () => {
        alert("Student deleted successfully");
        this.loadStudents();

        // Refresh student list or navigate away
      },
      error: (err) => {
        alert("Failed to delete student");
        console.error("Failed to delete student", err);
      }
    });
  }}

  onsubmit() {
   

    this.student.classId = Number(this.selectedClassId);
    // this.studentdb.student=this.student;  
    this.student.addresses = [];
    const dobRaw = this.student.dateOfBirth;
    if (this.correspondanceAddress != null && Number(this.correspondanceAddress.countryId) != 0) {
      this.correspondanceAddress.countryId = Number(this.correspondanceAddress.countryId);
      this.student.addresses.push(this.correspondanceAddress);
    }
    if (this.permanentAddress != null && Number(this.permanentAddress.countryId) != 0) {
      this.permanentAddress.countryId = Number(this.permanentAddress.countryId);
      this.student.addresses.push(this.permanentAddress);
    }

    if (this.schoolAddress != null && Number(this.schoolAddress.countryId) != 0) {
      this.schoolAddress.countryId = Number(this.schoolAddress.countryId);
      this.student.addresses.push(this.schoolAddress);
    }


    // Format as ISO without time ;(e.g., '1990-05-01')
    // const dob = dobRaw instanceof Date
    //   ? dobRaw.toISOString().substring(0, 10)
    //   : dobRaw;


    console.log(JSON.stringify(this.student));


    if (this.isEditMode) {

      this.studentService.updateStudent(this.student).subscribe({
        next: (response) => {
          alert('Student updated successfully:');
          console.log('Student created successfully:', response);
          //this.getAllStudents();
          this.loadStudents();
          // You can reset form, navigate or show a success message
        },
        error: (err) => {
          alert('Error updating student:');
          console.error('Error creating student:', err);
        }
      });
    }
    else {



      this.studentService.addStudent(this.student).subscribe({
        next: (response) => {
          alert('Student created successfully:');
          console.log('Student created successfully:', response);
          this.loadStudents();
          this.student={
            studentId: 0,
            firstName: '',
            lastName: '',
            email: '',
            dateOfBirth: '',
            classId: 0,
            class: {
              id: 1,
              className: '',
              students: []
            },
            addresses: [],
          };;
          // You can reset form, navigate or show a success message
        },
        error: (err) => {
          alert('Error creating student:');
          console.error('Error creating student:', err);
        }
      });
    }
  }


}
