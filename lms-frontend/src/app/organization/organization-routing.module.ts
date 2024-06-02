import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrgHomeComponent } from './org-home/org-home.component';
import { OrgAllTestsComponent } from './org-home/org-all-tests/org-all-tests.component';
import { OrgTestwiseStudentsComponent } from './org-home/org-test-wise-students/org-test-wise-students.component';


const routes: Routes = [
  { path: '',component:OrgHomeComponent, 
  children: [
    { path:'',component:OrgAllTestsComponent},
    { path:'test/:testId',component:OrgTestwiseStudentsComponent},
  ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationRoutingModule {}
