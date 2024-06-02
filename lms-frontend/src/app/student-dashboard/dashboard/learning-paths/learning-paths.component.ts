import { Component,Input } from '@angular/core';
import { Course } from 'src/app/types/course.type';

@Component({
  selector: 'app-learning-paths',
  templateUrl: './learning-paths.component.html',
  styleUrls: ['./learning-paths.component.css']
})
export class LearningPathsComponent {
@Input() courses:any[];
}
