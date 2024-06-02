import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { PublicStudentProfileComponent } from './public-student-profile/public-student-profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: 'student/:userid',
        component: StudentProfileComponent,
      },
      {
        path: 'public/student/:userid',
        component:PublicStudentProfileComponent
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class profileRoutingModule {}
