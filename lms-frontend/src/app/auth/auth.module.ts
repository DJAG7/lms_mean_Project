import { NgModule, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { AuthRoutingModule } from './auth-routing.module';
import { SignupComponent } from './signup/signup.component';
import { FormsModule} from '@angular/forms';
import { ForgotComponent } from './forgot/forgot.component';
import { VerifyComponent } from './verify/verify.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent,
    SignupComponent,
    ForgotComponent,
    VerifyComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AuthRoutingModule,
    NgSelectModule,
  ]
})
export class AuthModule { }
