import { Component } from '@angular/core';
import { StudentService } from '../../Services/student.service';
import { Student } from '../../Models/student.interface';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-students',
    imports: [FormsModule],
    templateUrl: './students.component.html',
    styleUrl: './students.component.css'
})
export class StudentsComponent {
  // student: Student = {
  //   id: 0,
  //   firstName: '',
  //   lastName: '',
  //   email: '',
  //   dateOfBirth: '',
  //  // major: ''
  // };

  constructor(private studentService: StudentService) {}
  saveStudent() {
    // this.studentService.saveStudent(this.student).subscribe(
    //   (response) => {
    //     console.log('Student saved successfully', response);
    //   },
    //   (error) => {
    //     console.error('Error saving student', error);
    //   }
    // );
  }
}
