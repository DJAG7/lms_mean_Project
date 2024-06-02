import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Course, CourseData } from 'src/app/types/course.type';
import { backendUrl } from './contants';
@Injectable({
  providedIn: 'root',
})
export class CourseApiService {
  url: string = backendUrl;
  constructor(private http: HttpClient) {}
  addCourse(course: CourseData, instructors: string[]) {
    return this.http.post(this.url + '/course/add', {
      ...course,
      instructors,
    });
  }
  editCourse(course: CourseData, instructors: string[]) {
    return this.http.post(this.url + '/course/edit', {
      ...course,
      instructorId:instructors[0],
    });
  }
  addDraftCourse(course: CourseData, instructors: string[]) {
    return this.http.post(this.url + '/course/add/draft', {
      ...course,
      instructors,
    });
  }
}
