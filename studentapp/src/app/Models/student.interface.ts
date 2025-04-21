export interface AddressCategory {
  id: number;
  addressCategoryName: string;
  addresses: string[];
}

export interface Country {
  id: number;
 countryName: string;
  addresses: string[];
}

export interface Address {
  id: number;
  addressline1: string;
  addressline2: string;
  addressline3: string;
  city: string;
  state: string;
  postalCode: string;
  studentId: number;
  student:  Student;
  countryId: number;
  country: Country;
  addressCategoryId: number;
  addressCategory: AddressCategory;
}

export interface StudentClass {
  id: number;
  className: string;
  students: Student[];
}

export interface Student {
  studentId: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  classId: number;
  class: StudentClass;
  addresses: Address[];
}
export class StudentDto {
    // student:Student= new Student;
    // address: Address[] = [];    
   // address:AddressTab=new AddressTab;
  
  }