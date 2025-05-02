import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student, StudentClass } from '../Models/student.interface';


@Injectable({
  providedIn: 'root'
})

export class StudentClassesService {

  private apiUrl = 'https://localhost:7205/api/Classes'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}
  getStudentClasses(): Observable<StudentClass[]> {

    return this.http.get<StudentClass[]>(this.apiUrl+'/GetClasses');
  }
  createClass(cls: StudentClass): Observable<StudentClass> {
    return this.http.post<StudentClass>(this.apiUrl+'/AddClasses' , cls);
  }


}
