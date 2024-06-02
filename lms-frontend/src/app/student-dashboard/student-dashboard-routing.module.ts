import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StudentTestComponent } from './student-test/student-test.component';

const routes: Routes = [
  { path: '',component:DashboardComponent },
  { path: 'student/tests',component:StudentTestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class studentDashboardRoutingModule {}
