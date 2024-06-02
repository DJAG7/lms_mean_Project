import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../types/course.type';
import { User } from '../types/user.type';
import { backendUrl } from './api/contants';
type basicobject = {
  [key: string]: string | number | null;
};
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url: string = backendUrl;
  constructor(private http: HttpClient) {}
  ngOnInit(): void {}
  signIn(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.url + '/expenses/splitexpense', {
      email: email,
      password: password,
    });
  }
  getStudentCourses(id: string): Observable<any> {
    return this.http.post<any>(
      this.url + '/student/courses/getStudentCourses',
      {
        studentid: id,
      }
    );
  }
  getCourses(): Observable<any> {
    return this.http.get<any>(this.url + '/course/getCourses');
  }
  enrollCourse(email: String, courseid: String): Observable<any> {
    return this.http.post<Course>(this.url + '/student/courses/enrollCourse', {
      email: email,
      courseid: courseid,
    });
  }
  getStudentCourse(id: String, courseid: string): Observable<any> {
    return this.http.post<any>(this.url + '/student/courses/getStudentCourse', {
      studentid: id,
      courseid: courseid,
    });
  }

  getLesson(
    studentid: string,
    courseid: string,
    lessonid: string,
    moduleid: string
  ): Observable<any> {
    return this.http.post<any>(this.url + '/student/courses/getStudentLesson', {
      studentId: studentid,
      courseId: courseid,
      moduleId: moduleid,
      lessonId: lessonid,
    });
  }
  lessonCompletd(
    studentid: string,
    courseid: String,
    moduleid: string,
    lessonid: string
  ): Observable<any> {
    return this.http.post<any>(this.url + '/student/courses/lessonCompleted', {
      studentId: studentid,
      courseId: courseid,
      moduleId: moduleid,
      lessonId: lessonid,
    });
  }
  runCustomCode(data: {
    code: string;
    input: string;
    language: String;
  }): Observable<any> {
    return this.http.post<any>(this.url + '/student/courses/executecode', data);
  }
  runSampleTestCases(data: {
    code: string;
    language: string;
    questionId: string;
  }): Observable<any> {
    return this.http.post<any>(this.url + '/compiler/runSampleTests', data);
  }
  uploadFile(data: any) {
    function toFormData<T>(data: any) {
      var formData = new FormData();
      formData.append('file', data.file);
      return formData;
    }
    return this.http.post(this.url + '/upload', toFormData(data));
  }
  getQuiz(data: any) {
    // console.log(data);
    return this.http.post(this.url + '/student/courses/quiz/getQuiz', data);
  }
  submitQuiz(data: any) {
    return this.http.post(this.url + '/student/courses/quiz/submitQuiz', data);
  }
  getStudentExp(data: any) {
    return this.http.post(this.url + '/student/details/getExp', data);
  }
  bulkEnroll(data: any, courseId: string) {
    // console.log(data);

    function toFormData() {
      var formData = new FormData();
      formData.append('excel', data);
      formData.append('courseId', courseId);
      return formData;
    }
    return this.http.post<any>(this.url + '/course/bulkEnroll', toFormData());
  }
  bulkEnrollTest(data: any, testId: string) {
    // console.log(data);

    function toFormData() {
      var formData = new FormData();
      formData.append('excel', data);
      formData.append('testId', testId);
      return formData;
    }
    return this.http.post<any>(this.url + '/test/bulkEnrollTest', toFormData());
  }
  getStudentOverview(id: any) {
    return this.http.post(this.url + '/student/details/getStudentOverview', {
      studentId: id,
    });
  }

  addTest(instructor: string, testData: string) {
    return this.http.post<any>(this.url + '/test/add', {
      instructor,
      testData,
    });
  }
  getInstructorTest(instructor: string) {
    return this.http.post<any>(this.url + '/test/instructorTests', {
      instructor,
    });
  }
  getStudentTest(student: string) {
    return this.http.post<any>(this.url + '/test/studentTests', {
      student,
    });
  }
  getTestById(type: string, testId: string, userId: string) {
    return this.http.post<any>(this.url + '/test/getTest', {
      type,
      testId,
      id: userId,
    });
  }
  startTest(type: string, testId: string, userId: string) {
    return this.http.post<any>(this.url + '/test/startTest', {
      type,
      testId,
      id: userId,
    });
  }
  getTestSummaryById(type: string, testId: string, userId: string) {
    return this.http.post<any>(this.url + '/test/getTestSummary', {
      type,
      testId,
      id: userId,
    });
  }
  submitTest(payload: any) {
    return this.http.post<any>(this.url + '/test/submit', payload);
  }
  testProctoring(payload: any) {
    return this.http.post<any>(this.url + '/test/proctoring', payload);
  }
  getOrganizations() {
    return this.http.get<any>(this.url + '/organization/getOrganizations');
  }
  getAllTests(): Observable<any> {
    return this.http.post<any>(this.url + '/test/getAllTests', {});
  }
  enrollTest(email: String, testId: String): Observable<any> {
    return this.http.post<Course>(this.url + '/test/enroll', {
      email: email,
      testId: testId,
    });
  }
  editTest(instructor: string, testData: string) {
    return this.http.post<any>(this.url + '/test/editTest', {
      instructor,
      testData,
    });
  }
  reviewTest(id: string, testId: string) {
    return this.http.post<any>(this.url + '/test/review', {
      id,
      testId,
    });
  }
  deleteTest(instructor: string, testId: string) {
    return this.http.post<any>(this.url + '/test/delete', {
      instructor,
      testId,
    });
  }
  getStudentProfile(userId: string, user: string) {
    return this.http.post<any>(this.url + '/profile/getStudentProfile', {
      userId,
      user,
    });
  }
  removeGithubAccess(email: string) {
    return this.http.post<any>(this.url + '/profile/removeGihubAccess', {
      email,
    });
  }
  getStudentRepos(userId: string) {
    return this.http.post<any>(this.url + '/profile/getStudentRepos', {
      userId,
    });
  }
  toggleStudentProfileVisibility(email: string, visibility: any) {
    return this.http.post<any>(this.url + '/profile/toggleProfileVisibility', {
      email,
      visibility,
    });
  }
  editProfilePicture(data: any) {
    function toFormData<T>(data: any) {
      console.log(data);
      var formData = new FormData();
      formData.append('file', data.file);
      formData.append('userId', data.userId);
      return formData;
    }
    return this.http.post(
      this.url + '/profile/editProfilePicture',
      toFormData(data)
    );
  }
  editProfileDetails(data: any) {
    return this.http.post(this.url + '/profile/editProfileDetails', data);
  }
  getTestReport(enrolledId: any) {
    return this.http.post(this.url + '/test/getReport', { enrolledId });
  }
  getOrgTests(data: any) {
    return this.http.post(this.url + '/organization/getOrgTests', data);
  }
  getOrgTestWiseStudents(data: any) {
    return this.http.post(
      this.url + '/organization/getOrgTestwiseStudents',
      data
    );
  }
  async getImageProxy(s3Url: string) {
    const data: any = await this.http
      .get(
        this.url +
          '/proxy/imageproxy' +
          encodeURIComponent(s3Url) +
          '&responseType=base64'
      )
      .toPromise();
    return data.base64;
  }
}
