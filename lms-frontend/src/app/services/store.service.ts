import { Injectable } from '@angular/core';
import { Course, CourseData } from '../types/course.type';
import { Module } from '../types/module.type';
import { AuthService } from './api/auth-api.service';
import { User } from '../types/user.type';
import { BehaviorSubject, tap, catchError, throwError, of } from 'rxjs';
import { CourseApiService } from './api/course-api.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { InstructorApiService } from './api/instructor-api.service';
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  //   user: User | null = {
  //     _id: "6471c1d2ac3ca8bfe6a08aa1",
  //     name:"ash ",
  //     firstname: "ash",
  //     lastname: " ",
  //     email: "a@a.com",
  //     profilePicture: "https://img.freepik.com/premium-vector/training-icon-vector-training-education-icon-blackboard-with-teacher-seminar-vector-sign_578506-396.jpg",
  //   };
  user: any = null;
  role: string;
  loggedInUser$: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  courseData: CourseData = {
    name: '',
    description: '',
    thumbnail: '',
    trailer: '',
    price: 0,
    difficulty: 'beginner',
    modules: [],
    tags: [],
    _id: '',
  };
  constructor(
    private authAPi: AuthService,
    private apiService: ApiService,
    private router: Router,
    private courseApi: CourseApiService,
    private instructorApis: InstructorApiService
  ) {}
  setUserDetails(field: string, data: any) {
    this.user.field = data;
    localStorage.setItem('user', JSON.stringify(this.user));
    this.loggedInUser$.next({ ...this.user, role: this.role });
  }
  loginStudent(email: string, password: string) {
    return this.authAPi.loginStudent(email, password).pipe(
      catchError((err) => {
        return throwError(() => new Error(err));
      }),
      tap((data) => {
        this.user = data;
        this.role = 'student';
        this.loggedInUser$.next({ ...this.user, role: this.role });
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('role', this.role);
      })
    );
  }
  verifyStudent(token: string) {
    return this.authAPi.verifyStudent(token).pipe(
      catchError((err) => {
        return throwError(() => new Error(err));
      }),
      tap((data) => {
        this.user = data;
        this.role = 'student';
        this.loggedInUser$.next({ ...this.user, role: this.role });
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('role', this.role);
      })
    );
  }
  loginInstructor(email: string, password: string) {
    return this.authAPi.loginInstructor(email, password).pipe(
      catchError((err) => {
        return throwError(() => new Error(err));
      }),
      tap((data) => {
        let { profilePicture, _id, firstname, lastname, email, name, role } =
          data;
        this.user = {
          profilePicture,
          _id,
          firstname,
          lastname,
          email,
          name,
          role,
        };
        this.role = 'instructor';
        this.loggedInUser$.next({ ...this.user, role: this.role });
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('role', this.role);
      })
    );
  }
  loginAdmin(email: string, password: string) {
    return this.authAPi.loginAdmin(email, password).pipe(
      catchError((err) => {
        return throwError(() => new Error(err));
      }),
      tap((data) => {
        this.user = {
          name: data.name,
          role: data.role,
          email: '',
          _id: data._id,
          firstname: '',
          lastname: '',
          profilePicture: '',
        };
        this.role = 'admin';
        this.loggedInUser$.next({ ...this.user, role: this.role });
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('role', this.role);
      })
    );
  }
  loginOrganization(org: string, password: string) {
    return this.authAPi.loginOrganization(org, password).pipe(
      catchError((err) => {
        return throwError(() => new Error(err));
      }),
      tap((data: any) => {
        this.user = {
          name: data?.organizationName,
          role: 'organization',
          email: '',
          _id: data._id,
          firstname: '',
          lastname: '',
          profilePicture: '',
        };
        this.role = 'organization';
        this.loggedInUser$.next({ ...this.user, role: this.role });
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('role', this.role);
      })
    );
  }
  logout() {
    this.user = null;
    this.role = null;
    this.loggedInUser$.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.router.navigate(['/auth/login']);
  }
  setExp(exp: any) {
    this.user.exp = exp;
    localStorage.setItem('user', JSON.stringify(this.user));
    this.loggedInUser$.next({ ...this.user, role: this.role });
  }
  autoLogin() {
    let userstr = localStorage.getItem('user');
    let user: User | null = null;
    user = JSON.parse(userstr) as User;
    let role = localStorage.getItem('role');

    this.user = user;
    this.role = role;
    if (this.role == 'instructor') this.router.navigate(['/instructor']);
    else if (this.role == 'admin') this.router.navigate(['/admin']);
    else if (this.role == 'organization')
      this.router.navigate(['/organization']);
    // if (role == 'student' || role == 'instructor') this.role = role;
    // console.log('AUTOLOGIN', this.user,userstr);
    if (this.user) {
      this.loggedInUser$.next({ ...this.user, role: this.role });
    } else {
      this.loggedInUser$.next(null);
    }
  }
  setPrimaryCourseData(data: {
    name: string;
    description: string;
    thumbnail: string;
    trailer: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    price: number;
    tags: string[];
    _id?: string;
  }) {
    console.log(data);
    this.courseData.name = data.name;
    this.courseData.description = data.description;
    this.courseData.thumbnail = data.thumbnail;
    this.courseData.trailer = data.trailer;
    this.courseData.difficulty = data.difficulty;
    this.courseData.price = data.price;
    this.courseData.tags = data.tags;
    this.courseData._id = data?._id ? data?._id : '';
  }

  addModule(data: Module) {
    // this.courseData.modules = [...this.courseData.modules, data];
    this.courseData.modules.push(data);
    console.log(data);
  }
  getStudentCourse(courseid: string) {
    return this.apiService.getStudentCourse(this.user._id, courseid);
  }
  getInstructorCourse(courseid: string) {
    return this.instructorApis.getCoursebyId(this.user._id, courseid);
  }
  deleteCourse(courseid: string) {
    if (this.role == 'instructor') {
      return this.instructorApis.deleteCourse(this.user._id, courseid);
    }
  }
  addCourse() {
    return this.courseApi.addCourse(this.courseData, [this.user._id]).pipe(
      tap((data) => {
        this.resetCourse();
      })
    );
  }
  editCourse() {
    return this.courseApi.editCourse(this.courseData, [this.user._id]).pipe(
      tap((data) => {
        this.resetCourse();
      })
    );
  }
  addDraftCourse() {
    return this.courseApi.addDraftCourse(this.courseData, [this.user._id]).pipe(
      tap((data) => {
        this.resetCourse();
      })
    );
  }
  resetCourse() {
    this.courseData = {
      name: '',
      description: '',
      thumbnail: '',
      trailer: '',
      price: 0,
      difficulty: 'beginner',
      modules: [],
      tags: [],
    };
  }
}
