import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { StudentReportComponent } from './reports/student-report/student-report.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: 'student/:enrollid',
        component: StudentReportComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class reportsRoutingModule {}
