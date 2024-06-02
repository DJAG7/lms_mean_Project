import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { studentDashboardRoutingModule } from './student-dashboard-routing.module';
import { LearningPathsComponent } from './dashboard/learning-paths/learning-paths.component';
import { CoursesComponent } from './dashboard/dashboard-courses/courses.component';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { QuizzesModule } from '../quizzes/quizzes.module';

@NgModule({
  declarations: [
    DashboardComponent,
    LearningPathsComponent,
    CoursesComponent,
    OverviewComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    QuizzesModule,
    studentDashboardRoutingModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
})
export class StudentDashboardModule {}
