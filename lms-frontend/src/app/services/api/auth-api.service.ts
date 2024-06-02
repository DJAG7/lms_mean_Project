import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/types/user.type';
import { backendUrl } from './contants';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = backendUrl;
  constructor(private http: HttpClient) {}
  loginStudent(email: string, password: string) {
    return this.http.post<User>(this.url + '/student/login', {
      email,
      password,
    });
  }
  registerStudent(email: string, name: string, password: string,organization:string) {
    return this.http.post<User>(this.url + '/student/register', {
      email,
      name,
      password,
      organization
    });
  }
  loginInstructor(email: string, password: string) {
    return this.http.post<User>(this.url + '/instructor/login', {
      email,
      password,
    });
  }
  registerInstructor(email: string, name: string, password: string) {
    return this.http.post<User>(this.url + '/instructor/register', {
      email,
      name,
      password,
    });
  }
  loginAdmin(email: string, password: string) {
    return this.http.post<User>(this.url + '/admin/login', { email, password });
  }
  registerAdmin(email: string, name: string, password: string) {
    return this.http.post<User>(this.url + '/admin/register', {
      email,
      name,
      password,
    });
  }
  studentForgotPassword(email: string) {
    return this.http.post<any>(this.url + '/student/forgotPassword', { email });
  }
  studentChangePassword(
    password: string,
    confirmPassword: string,
    token: string
  ) {
    return this.http.post<any>(this.url + '/student/changePassword', {
      password,
      confirmPassword,
      token,
    });
  }
  verifyStudent(token: string) {
    return this.http.post<any>(this.url + '/student/verifyStudent', { token });
  }
  loginOrganization(org: string, password: string) {
    return this.http.post<User>(this.url + '/organization/login', {
      org,
      password,
    });
  }
}
