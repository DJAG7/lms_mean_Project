import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/types/course.type';

@Component({
  selector: 'app-path-card',
  templateUrl: './path-card.component.html',
  styleUrls: ['./path-card.component.css'],
})
export class PathCardComponent {
  @Input() course: any;
  constructor(private router: Router) {}
  resume() {
    if (this.course.type == 'lesson') {
      this.router.navigate([
        'lessons',
        this.course._id,
        this.course.resumeModuleId,
        this.course.resumeLessonId,
      ]);
    } else if (this.course.type == 'assignment') {
      this.router.navigate([
        'quizzes',
        'quiz',
        'assignment',
        this.course._id,
        this.course.resumeModuleId,
        this.course.resumeLessonId,
      ]);
    } else {
      this.router.navigate([
        'quizzes',
        'quiz',
        'assessment',
        this.course._id,
        this.course.resumeModuleId,
        this.course.resumeLessonId,
      ]);
    }
  }
}
