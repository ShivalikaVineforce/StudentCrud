import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentsComponent } from './Components/students/students.component';
//import { StudentFormComponent } from './Components/student-form/student-form.component';
import { StudentDetailsComponent } from './Components/student-details/student-details.component';
import { ClassesComponent } from './Components/classes/classes.component';
import { AddressCategoryComponent } from './Components/address-category/address-category.component';

export const routes: Routes = [
  { path: '', component: StudentDetailsComponent },
  { path: 'classes', component: ClassesComponent },
  { path: 'students', component: StudentsComponent },
  { path: 'address-category', component: AddressCategoryComponent },
 // { path: 'student-form', component: StudentFormComponent },
  { path: 'student-details', component: StudentDetailsComponent },
//   { path: '**', component: NotFoundComponent }  // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
