import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentsComponent } from './Components/students/students.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MyInterceptor } from './Services/MyInterceptor';
//import { StudentFormComponent } from './Components/student-form/student-form.component';
import { StudentDetailsComponent } from './Components/student-details/student-details.component';

@NgModule({
  declarations: [
    AppComponent,StudentsComponent,StudentDetailsComponent
  ],
  imports: [  
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,NgModule,
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS, // Add the interceptor to the HTTP_INTERCEPTORS array
    useClass: MyInterceptor,
    multi: true, // This ensures multiple interceptors can be used if needed
  },provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
