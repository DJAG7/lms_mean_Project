import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCourseComponent } from './add-course/add-course.component';
import { InstructorComponent } from './instructor.component';
import { InstructorRoutingModule } from './instructor-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddModuleComponent } from './add-module/add-module.component';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../shared/shared.module';
import { InstructorDashboardComponent } from './dashboard/dashboard.component';
import { InstructorCoursesComponent } from './dashboard/dashboard-courses/courses.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { CourseTimelineComponent } from './course-timeline/course-timeline.component';
import { InsCourseCardComponent } from './ins-course-card/ins-course-card.component';
import { InsTakeCourseComponent } from './ins-take-course/ins-take-course.component';
import { InsCourseComponent } from './ins-course/ins-course.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { EditModuleComponent } from './edit-module/edit-module.component';
import { AddTestComponent } from './add-test/add-test.component';
import { InsTestsComponent } from './ins-tests/ins-tests.component';
import { DragDropModule } from '@angular/cdk/drag-drop';



@NgModule({
  declarations: [
    AddCourseComponent,
    AddModuleComponent,
    InstructorComponent,
    InstructorDashboardComponent,
    InstructorCoursesComponent,
    CourseTimelineComponent,
    InsCourseComponent,
    InsTakeCourseComponent,
    InsCourseCardComponent,
    EditCourseComponent,
    EditModuleComponent,
    AddTestComponent,
    InsTestsComponent,

  ],
  imports: [
    CommonModule,
    InstructorRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    QuillModule.forRoot(),
    NgSelectModule,
    DragDropModule
  ]
})
export class InstructorModule { }
