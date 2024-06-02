import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/types/user.type';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-take-lesson',
  templateUrl: './take-lesson.component.html',
  styleUrls: ['./take-lesson.component.css'],
})
export class TakeLessonComponent {
  courseid: string;
  moduleid: string;
  lessonid: string;
  user: User;
  course: any;
  userSubscription: Subscription;
  lesson: {
    content: { contentType: string; contentData: string };
    length: { hour: any; minutes: any };
    name: string;
    description: string;
    _id: string;
  } | null = null;
  courseCompleted: boolean = false;
  lessonCompleted: boolean = false;
  previousLesson: any;
  nextLesson: any;
  showEditor: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private storeService: StoreService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private ref: ChangeDetectorRef
  ) {}
  ngOnInit() {
    this.userSubscription = this.storeService.loggedInUser$.subscribe({
      next: (data) => {
        this.user = data;
      },
      error: () => {},
    });
    this.route.params.subscribe((params) => {
      this.courseid = params['courseid'];
      this.moduleid = params['moduleid'];
      this.lessonid = params['lessonid'];

      this.apiService
        .getLesson(this.user._id, this.courseid, this.lessonid, this.moduleid)
        .subscribe({
          next: (data) => {
            this.course = data.course;
            data = data.data;

            this.lesson = data.currentLesson;
            this.previousLesson = data.previousLesson;
            this.nextLesson = data.nextLesson;
            this.courseCompleted = data.courseCompleted;
            this.lessonCompleted = data.lessonCompleted;
          },
          error: (err) => {},
        });
    });
  }
  photoURL(data: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(data);
  }
  completed() {
    this.apiService
      .lessonCompletd(
        this.user._id,
        this.courseid,
        this.moduleid,
        this.lessonid
      )
      .subscribe({
        next: (data) => {
          data = data.data;
          this.apiService
            .getStudentExp({ studentId: this.user._id })
            .subscribe({
              next: (data: any) => {
                this.storeService.setExp(data.exp);
                if (
                  this.nextLesson.moduleId != '-1' &&
                  this.nextLesson.LessonId != '-1' &&
                  !data.courseCompleted
                ) {
                  if (this.nextLesson.type == 'lesson') {
                    this.router.navigate([
                      'lessons/' +
                        this.courseid +
                        '/' +
                        this.nextLesson.moduleId +
                        '/' +
                        this.nextLesson.lessonId,
                    ]);
                  } else {
                    this.router.navigate([
                      'quizzes/quiz/' +
                        this.nextLesson.type +
                        '/' +
                        this.courseid +
                        '/' +
                        this.nextLesson.moduleId +
                        '/' +
                        this.nextLesson.lessonId,
                    ]);
                  }
                } else {
                  this.router.navigate(['/']);
                }
              },
              error: (err) => {},
            });
        },
        error: (err) => {},
      });
  }
  handleNextLesson() {
    if (this.nextLesson.moduleId != '-1' && this.nextLesson.LessonId != '-1') {
      if (this.nextLesson.type == 'lesson') {
        this.router.navigate([
          'lessons/' +
            this.courseid +
            '/' +
            this.nextLesson.moduleId +
            '/' +
            this.nextLesson.lessonId,
        ]);
      } else {
        this.router.navigate([
          'quizzes/quiz/' +
            this.nextLesson.type +
            '/' +
            this.courseid +
            '/' +
            this.nextLesson.moduleId +
            '/' +
            this.nextLesson.lessonId,
        ]);
      }
    } else {
      this.router.navigate([
        'student' +
          this.nextLesson.type +
          '/' +
          this.courseid +
          '/' +
          this.nextLesson.moduleId +
          '/' +
          this.nextLesson.lessonId,
      ]);
    }
  }
  handlePreviousLesson() {
    if (
      this.previousLesson.moduleId != '-1' &&
      this.previousLesson.LessonId != '-1'
    ) {
      if (this.previousLesson.type == 'lesson') {
        this.router.navigate([
          'lessons/' +
            this.courseid +
            '/' +
            this.previousLesson.moduleId +
            '/' +
            this.previousLesson.lessonId,
        ]);
      } else {
        this.router.navigate([
          'quizzes/quiz/' +
            this.previousLesson.type +
            '/' +
            this.courseid +
            '/' +
            this.previousLesson.moduleId +
            '/' +
            this.previousLesson.lessonId,
        ]);
      }
    }
  }
  toggleCodeEditor() {
    this.showEditor = !this.showEditor;
  }
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
