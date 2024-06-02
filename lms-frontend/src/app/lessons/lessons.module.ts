import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TakeLessonComponent } from './lessons/take-lesson/take-lesson.component';
import { SharedModule } from '../shared/shared.module';
import { lessonsRoutingModule } from './lessons-routing.module';
import { LessonsComponent } from './lessons/lessons.component';



@NgModule({
  declarations: [
    TakeLessonComponent,
    LessonsComponent
  ],
  imports: [
    CommonModule,
    lessonsRoutingModule,
    SharedModule
  ]
})
export class LessonsModule { }
