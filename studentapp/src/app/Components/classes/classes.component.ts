import { Component } from '@angular/core';
import { StudentClass } from '../../Models/student.interface';
import { StudentClassesService } from '../../Services/student-classes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-classes',
    
    imports: [FormsModule, CommonModule, HttpClientModule],
    templateUrl: './classes.component.html',
    providers: [HttpClient, StudentClassesService],
    styleUrl: './classes.component.css'
})
export class ClassesComponent {

    studentClass: StudentClass = {
        className: '',
        id: 0,
        students: []
    };
    showForm: boolean = true;

    constructor(private router: Router,private service: StudentClassesService) {}
  
    submit() {
      this.service.createClass(this.studentClass).subscribe({
        next: (res) => {
          console.log('Class created:', res);
          alert('Class added successfully!');
          this.cancel (); // reset
        },
        error: (err) => {
          console.error('Error:', err);
          alert('Failed to save class.');
        },
      });
    }cancel() {
      this.showForm = false;
      this.router.navigate(['/student-details']);
      this.studentClass= {
        className: '',
        id: 0,
        students: []
    };
      }
  }
  
