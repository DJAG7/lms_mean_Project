import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentReportComponent } from './reports/student-report/student-report.component';
import { ReportsComponent } from './reports/reports.component';
import { reportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [StudentReportComponent, ReportsComponent],
  imports: [CommonModule, SharedModule, reportsRoutingModule],
})
export class ReportsModule {}
