import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DataTablesModule} from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { OrgHomeComponent } from './org-home/org-home.component';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrgAllTestsComponent } from './org-home/org-all-tests/org-all-tests.component';
import { OrgTestwiseStudentsComponent } from './org-home/org-test-wise-students/org-test-wise-students.component';


@NgModule({
  declarations: [
    OrgHomeComponent,
    OrgAllTestsComponent,
    OrgTestwiseStudentsComponent
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    OrganizationRoutingModule
  ]
})
export class OrganizationModule { }
