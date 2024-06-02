import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { Course } from 'src/app/types/course.type';
@Component({
  selector: 'app-take-course',
  templateUrl: './take-course.component.html',
  styleUrls: ['./take-course.component.css'],
})
export class TakeCourseComponent {
  courseid: string;
  resumeLessonId: string;
  resumeModuleId: string;
  enrolledCourseModuleMappings: any;
  courseModules: any[];
  courseCompleted: boolean;
  course: Course;
  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.courseid = params['courseid'];
      this.storeService.getStudentCourse(this.courseid).subscribe({
        next: (data) => {
          this.course = data.course;
          this.resumeLessonId = data.resumeLessonId;
          this.resumeModuleId = data.resumeModuleId;
          this.enrolledCourseModuleMappings =
            data.enrolledCourseModulesMappings;
          this.courseModules = data.courseModules;
          this.courseCompleted = data.completed;
          // console.log(data)
        },
      });
    });
  }
}
