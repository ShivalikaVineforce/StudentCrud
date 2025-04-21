import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentsComponent } from './Components/students/students.component';
//import { StudentFormComponent } from './Components/student-form/student-form.component';
import { StudentDetailsComponent } from './Components/student-details/student-details.component';

export const routes: Routes = [

  { path: 'students', component: StudentsComponent },
 // { path: 'student-form', component: StudentFormComponent },
  { path: 'student-details', component: StudentDetailsComponent },
//   { path: '**', component: NotFoundComponent }  // Wildcard route for 404
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
