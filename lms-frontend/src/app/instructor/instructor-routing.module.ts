import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCourseComponent } from './add-course/add-course.component';
import { InstructorComponent } from './instructor.component';
import { AddModuleComponent } from './add-module/add-module.component';
import { InstructorDashboardComponent } from './dashboard/dashboard.component';
import { InsCourseComponent } from './ins-course/ins-course.component';
import { InsTakeCourseComponent } from './ins-take-course/ins-take-course.component';
import { EditModuleComponent } from './edit-module/edit-module.component';
import { EditCourseComponent } from './edit-course/edit-course.component';
import { AddTestComponent } from './add-test/add-test.component';
import { InsTestsComponent } from './ins-tests/ins-tests.component';

const routes: Routes = [{
  path:"",
  component:InstructorComponent,
  children:[{
    path:'add-course',
    component:AddCourseComponent
  },
  {
    path:'add-module',
    component:AddModuleComponent
  },
  {
    path:'courses',
    component:InsCourseComponent,
    children:[{
      path:":courseid",
      component:InsTakeCourseComponent
    }]
  },
  {
    path:'edit',
    component:InsCourseComponent,
    children:[
      {
        path:":courseid/add",
        component:AddModuleComponent
      },
      {
        path:":courseid/:moduleid",
        component:EditModuleComponent
      }
      ,{
      path:":courseid",
      component:EditCourseComponent
    }]
  },
  {
    path:'tests',
    component:InsTestsComponent
  },
  {
    path:'add-test',
    component:AddTestComponent
  },
  {
    path:'edit-test/:testId',
    component:AddTestComponent
  },
  {
    path:'',
    component:InstructorDashboardComponent
  }
]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule { }
