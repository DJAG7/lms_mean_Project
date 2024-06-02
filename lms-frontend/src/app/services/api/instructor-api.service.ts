import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course, CourseData } from 'src/app/types/course.type';
import { backendUrl } from './contants';
@Injectable({
  providedIn: 'root',
})
export class InstructorApiService {
  url: string = backendUrl;
  constructor(private http: HttpClient) {}
  getCourses(email: string) {
    return this.http.post<{ courses: Course[] }>(
      this.url + '/instructor/courses/getCourses',
      { email }
    );
  }
  getCoursebyId(instructor: string, courseId: string) {
    return this.http.post<any>(this.url + '/instructor/courses/getCourse', {
      courseId,
      instructor,
    });
  }
  deleteCourse(instructor: string, courseId: string) {
    return this.http.post<any>(this.url + '/course/delete', {
      instructor,
      courseId,
    });
  }
}
