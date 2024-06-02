import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/api/auth-api.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  selectedRole = 'student';
  email: string = '';
  password: string = '';
  forgotPassword: boolean = false;
  organization: string = null;
  organizations: any = [];
  constructor(
    private storeService: StoreService,
    private router: Router,
    private toastr: ToastrService,
    private authApiService: AuthService,
    private apiService: ApiService
  ) {}
  ngOnInit(): void {
    this.apiService.getOrganizations().subscribe({
      next: (data) => {
        this.organizations = data.organizations;
        // console.log(this.organizations);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  selectRole(role: string) {
    this.selectedRole = role;
  }
  login() {
    let loginObs: Observable<any>;
    if (this.selectedRole === 'student') {
      loginObs = this.storeService.loginStudent(this.email, this.password);
    } else if (this.selectedRole === 'instructor') {
      loginObs = this.storeService.loginInstructor(this.email, this.password);
    } else if (this.selectedRole === 'admin') {
      loginObs = this.storeService.loginAdmin(this.email, this.password);
    } else if (this.selectedRole === 'organization') {
      loginObs = this.storeService.loginOrganization(
        this.organization,
        this.password
      );
      // return;
    }
    loginObs.subscribe({
      next: (data) => {
        if (this.selectedRole === 'admin')
          this.router.navigate(['/admin/courses']);
        else if (this.selectedRole === 'instructor')
          this.router.navigate(['/instructor']);
        else if (this.selectedRole === 'organization')
          this.router.navigate(['/organization']);
        else this.router.navigate(['']);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  handleForgotPassword() {
    this.forgotPassword = true;
  }
  reset() {
    this.authApiService.studentForgotPassword(this.email).subscribe({
      next: (data) => {
        this.forgotPassword = false;
        this.toastr.success('An email sent if email address is registered.');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  back() {
    this.forgotPassword = false;
  }
}
