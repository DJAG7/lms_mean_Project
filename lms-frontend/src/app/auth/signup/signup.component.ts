import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/api/auth-api.service';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  selectedRole = 'student';
  email: string = '';
  name: string = '';
  password: string = '';
  ConfirmPassword: string = '';
  organization: string = null;
  organizations: any = [];
  constructor(
    private authApi: AuthService,
    private router: Router,
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.apiService.getOrganizations().subscribe({
      next: (data) => {
        this.organizations = data.organizations.map((item: any, i: any) => {
          return { value: item.id, label: item.name };
        });
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
  isDisable() {
    if (
      this.organization == null ||
      this.name == '' ||
      this.email == '' ||
      this.password == '' ||
      this.ConfirmPassword != this.password
    ) {
      return true;
    }
    return false;
  }
  signUp() {
    let signIn$: Observable<any>;
    if (this.selectedRole === 'student') {
      signIn$ = this.authApi.registerStudent(
        this.email,
        this.name,
        this.password,
        this.organization
      );
    } else if (this.selectedRole === 'instructor') {
      signIn$ = this.authApi.registerInstructor(
        this.email,
        this.name,
        this.password
      );
    } else if (this.selectedRole === 'admin') {
      signIn$ = this.authApi.registerAdmin(
        this.email,
        this.name,
        this.password
      );
    }
    signIn$.subscribe(
      (data) => {
        // console.log(data);
        if (this.selectedRole === 'student') {
          this.toastr.success('Please verify you email');
        }
        this.router.navigate(['auth', 'login']);
      },
      (err) => {
        console.log(err);
        if (err.status === 406) {
          alert('User Already Registered');
          return;
        }
        alert('Something Went Wrong!!');
      }
    );
  }
}
