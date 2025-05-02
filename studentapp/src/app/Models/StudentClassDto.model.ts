import { Address, Student } from "./student.interface";



 
  export interface AddressDto {
    addressline1: string;
    city: string;
    state: string;
    postalCode: string;
    countryName: string;
    addressCategoryName: string;
  }
  
  export interface StudentDetailsDto {
    id: number;
    // fullName: string;
    // email: string;
    // className: string;
    addresses: Address[];
    student:Student;
   // addressCategory:string;
  
  }
  export interface StudentAddressSearch {
    addressline1: string;
    addressline2: string;
    addressline3: string;
    city: string;
    state:string;
    countryName: string;
    postalCode:string;
    addressCategoryName: string;
  }
  
  export interface StudentSearch {
    studentId: number;
   // fullName: string;
   firstName: string;
   lastName: string;
    email: string;
    dateOfBirth:Date;
    className: string;
    addresses: StudentAddressSearch[];
  }