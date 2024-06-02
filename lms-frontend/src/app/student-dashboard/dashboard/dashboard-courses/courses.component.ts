import { Component,Input } from '@angular/core';
import { Course } from 'src/app/types/course.type';

@Component({
  selector: 'app-dashboard-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  @Input() courses:any[]=[];
  constructor(){
  }
  ngOnInit(): void {
  
  }
}
