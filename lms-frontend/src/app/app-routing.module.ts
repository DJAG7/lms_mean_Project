import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './student-dashboard/dashboard/dashboard.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: 'lessons',
    canActivate: [AuthGuard],
    data: {
      role: 'student',
    },
    loadChildren: () =>
      import('./lessons/lessons.module').then((m) => m.LessonsModule),
  },
  {
    path: 'courses',
    canActivate: [AuthGuard],
    data: {
      role: 'student',
    },
    loadChildren: () =>
      import('./courses/courses.module').then((m) => m.CoursesModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: {
      role: 'admin',
    },
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'instructor',
    canActivate: [AuthGuard],
    data: {
      role: 'instructor',
    },
    loadChildren: () =>
      import('./instructor/instructor.module').then((m) => m.InstructorModule),
  },
  {
    path: 'quizzes',
    data: {
      role: 'student',
    },
    loadChildren: () =>
      import('./quizzes/quizzes.module').then((m) => m.QuizzesModule),
  },
  {
    path: 'profile',
    data: {
      role: 'student',
    },
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },
  {
    path: 'organization',
    data: {
      role: 'organization',
    },
    loadChildren: () =>
      import('./organization/organization.module').then(
        (m) => m.OrganizationModule
      ),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    data: {
      role: 'student',
    },
    loadChildren: () =>
      import('./student-dashboard/student-dashboard.module').then(
        (m) => m.StudentDashboardModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
