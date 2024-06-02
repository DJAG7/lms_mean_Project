import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoursesComponent } from './courses/courses.component';
import { TakeCourseComponent } from './take-course/take-course.component';


const routes: Routes = [{ path: '',component:CoursesComponent, children: [
  { path: ':courseid', component: TakeCourseComponent },
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class coursesRoutingModule {}
