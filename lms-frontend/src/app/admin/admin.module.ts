import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { ShowCoursesComponent } from './admin/show-courses/show-courses.component';
import { adminsRoutingModule } from './admin-routing.module';
import {DataTablesModule} from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { ShowTestsComponent } from './admin/show-tests/show-tests.component';


@NgModule({
  declarations: [
    AdminComponent,
    ShowCoursesComponent,
    ShowTestsComponent
  ],
  imports: [
    CommonModule,
    adminsRoutingModule,
    DataTablesModule,
    FormsModule
  ]
})
export class AdminModule { }
