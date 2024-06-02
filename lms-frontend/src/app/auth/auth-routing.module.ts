import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotComponent } from './forgot/forgot.component';
import { VerifyComponent } from './verify/verify.component';



const routes: Routes = [{ path: '',component:AuthComponent,children:[
    {path:'forgot/:token',component:ForgotComponent},
    {path:'confirm/:token',component:VerifyComponent},
    {path:'login',component:LoginComponent},
    {path:'signup',component:SignupComponent},
    {path:'instructor/login',component:SignupComponent},
]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
