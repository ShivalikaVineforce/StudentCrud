import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AddressCategory, StudentClass } from '../Models/student.interface';

@Injectable({
  providedIn: 'root'
})
export class AddresscategoryService {

  private apiUrl = 'https://localhost:7205/api/AddressCategory'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}
  getAddressCategories(): Observable<AddressCategory[]> {

    return this.http.get<AddressCategory[]>(this.apiUrl+'/GetAddressCategory');
  }
  AddAddressCategories(cls: AddressCategory): Observable<AddressCategory> {
    debugger;
    return this.http.post<AddressCategory>(this.apiUrl+'/AddAddressCategory' , cls);
  }

}
