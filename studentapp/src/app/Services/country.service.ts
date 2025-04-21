import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../Models/student.interface';


@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiUrl = 'https://localhost:7205/api/Coutries/CountryList'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {

    return this.http.get<Country[]>(this.apiUrl);
  }
}
