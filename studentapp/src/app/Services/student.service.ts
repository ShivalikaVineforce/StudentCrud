import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../Models/student.interface';
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

  addStudent(student: Student): Observable<Student> {
   debugger;
   console.log(student);
    return this.http.post<Student>(this.apiUrl+"/AddStudentsInfo", student);
  }

  getStudentsForEdit(studentid:number): Observable<StudentDetailsDto[]> {
   
    const params = new HttpParams().set('studentId', studentid);
    
    return this.http.get<StudentDetailsDto[]>(this.apiUrl+'/StudentsInfo',{params});
  }  

  getStudents(name: string,  pageNumber: number, pageSize: number ,sortColumn: string, sortDirection: string): Observable<any> {
    let params = new HttpParams()
      .set('searchTerm', name || '')
      .set('sortColumn', sortColumn || '')
      .set('sortDirection', sortDirection || '')     
      .set('PageNumber', pageNumber)
      .set('PageSize', pageSize);

  debugger;
    return this.http.get<any>(`${this.apiUrl}/GetStudentsSearch`, { params });
  }

  getPaginatedStudents(pageNumber: number, pageSize: number): Observable<PaginatedResult> {

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PaginatedResult>(this.apiUrl + '/GetPaginatedStudents', { params });
  }


  updateStudent(student: Student): Observable<void> {
debugger;
    return this.http.put<void>(this.apiUrl + '/UpdateStudent', student);
  }
  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/DeleteStudent/${id}`);
  }
  getStudentsSearch(params: any): Observable<any> {
    return this.http.get<any>('https://localhost:5001/api/students', { params });
  }

}

