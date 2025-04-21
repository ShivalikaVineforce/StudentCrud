import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, StudentDto } from '../Models/student.interface';
import { StudentDetailsDto } from '../Models/StudentClassDto.model';

interface PaginatedResult {
  TotalCount: number;
  PageNumber: number;
  PageSize: number;
  Services: any[];
  StudentDto:any[];
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  
  private apiUrl = 'https://localhost:7205/api/Students'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Method to save a student
  saveStudent(student: StudentDto): Observable<StudentDto> {
   
    return this.http.post<StudentDto>(this.apiUrl+"/Addstudent", student);
  }

  addStudent(student: Student): Observable<Student> {
   
    return this.http.post<Student>(this.apiUrl+"/AddStudentsInfo", student);
  }

  getStudentsForEdit(studentid:number): Observable<StudentDetailsDto[]> {
   
    const params = new HttpParams().set('studentId', studentid);
    //const headers = this.authService.createAuthHeaders();  
    return this.http.get<StudentDetailsDto[]>(this.apiUrl+'/StudentsInfo',{params});
  }

  // getStudents(): Observable<Student[]> {


  //   return this.http.get<Student[]>(this.apiUrl+'/GetStudents');
  // }

  // getStudents(searchTerm: string, page: number, pageSize: number): Observable<any> {
  //   let params = new HttpParams()
  //     .set('SearchTerm', searchTerm)
  //     .set('PageNumber', page)

  //   return this.http.get<any>(this.apiUrl +'/GetStudentsSearch', { params });
  // }

  getStudents(name: string, email: string, pageNumber: number, pageSize: number): Observable<any> {
    let params = new HttpParams()
      .set('Name', name || '')
      .set('Email', email || '')
      .set('PageNumber', pageNumber)
      .set('PageSize', pageSize);
  
    return this.http.get<any>(`${this.apiUrl}/GetStudentsSearch`, { params });
  }

  getPaginatedStudents(pageNumber: number, pageSize: number): Observable<PaginatedResult> {

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResult>(this.apiUrl + '/GetPaginatedStudents', { params });
  }


  updateStudent(student: Student): Observable<void> {

    return this.http.put<void>(this.apiUrl + '/UpdateStudent', student);
  }
  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/DeleteStudent/${id}`);
  }
  getStudentsSearch(params: any): Observable<any> {
    return this.http.get<any>('https://localhost:5001/api/students', { params });
  }

}

