
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private apiUrl = 'https://localhost:7205/api/AddressCategory'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Method to save a student
  getAddressCategory(): Observable<any[]> {

    return this.http.get<any[]>(this.apiUrl+'/GetAddressCategory');
  }

}





