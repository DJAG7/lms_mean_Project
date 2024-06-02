import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { profileRoutingModule } from './profile-routing.module';
import { StudentProfileComponent } from './student-profile/student-profile.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PublicStudentProfileComponent } from './public-student-profile/public-student-profile.component';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ProfileComponent,
    StudentProfileComponent,
    PublicStudentProfileComponent,
  ],
  imports: [
    CommonModule,
    profileRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    NgSelectModule,
  ],
})
export class ProfileModule {}
