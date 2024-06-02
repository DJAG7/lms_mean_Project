import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { ShowCoursesComponent } from './admin/show-courses/show-courses.component';
import { ShowTestsComponent } from './admin/show-tests/show-tests.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'courses', component: ShowCoursesComponent },
      { path: 'tests', component: ShowTestsComponent },
      { path: '**', redirectTo: 'courses', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class adminsRoutingModule {}
