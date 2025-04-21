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
  