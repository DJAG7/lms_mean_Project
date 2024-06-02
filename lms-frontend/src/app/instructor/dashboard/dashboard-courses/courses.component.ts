import { Component,Input } from '@angular/core';
import { Course } from 'src/app/types/course.type';

@Component({
  selector: 'app-dashboard-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class InstructorCoursesComponent {
  @Input() courses:Course[]=[];
  @Input() name:string;
  constructor(){
  }
  ngOnInit(): void {
  
  }
}
