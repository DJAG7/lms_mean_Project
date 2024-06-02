import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LessonsComponent } from './lessons/lessons.component';
import { TakeLessonComponent } from './lessons/take-lesson/take-lesson.component';

const routes: Routes = [{ path: '',component:LessonsComponent,  children: [
  { path: ':courseid/:moduleid/:lessonid', component: TakeLessonComponent },
],}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class lessonsRoutingModule {}
