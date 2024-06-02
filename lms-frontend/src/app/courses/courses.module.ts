import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakeCourseComponent } from './take-course/take-course.component';
import { CoursesComponent } from './courses/courses.component';
import { SharedModule } from '../shared/shared.module';
import { coursesRoutingModule } from './courses-routing.module';

@NgModule({
  declarations: [TakeCourseComponent, CoursesComponent],
  imports: [
    CommonModule,
    coursesRoutingModule,
    SharedModule,
    coursesRoutingModule,
  ],
})
export class CoursesModule {}
