import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
})
export class QuizComponent {
  user: any;
  quizType: string;
  courseId: string;
  moduleId: string;
  quizId: string;
  quiz: any;
  questionIndex: number = 0;
  showQuestion: any;
  lastQuestion: boolean = false;
  firstQuestion: boolean = true;
  showTimer: boolean = false;
  output: string = '';
  questions: any = [];
  questionType: string;
  answers: any = [];
  quizForm: FormGroup;
  userSubscription: any;
  resultData: any;
  course: any;
  @ViewChild('resultModal') resultModal: TemplateRef<any>;
  resultModalInstance: any;
  constructor(
    private storeService: StoreService,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.quizForm = new FormGroup({
      questions: new FormArray([]),
    });
    this.route.params.subscribe((params) => {
      this.quizType = params['quiztype'];
      this.courseId = params['courseid'];
      this.moduleId = params['moduleid'];
      this.quizId = params['quizid'];
      this.apiService
        .getQuiz({
          quizid: this.quizId,
          courseid: this.courseId,
          moduleid: this.moduleId,
        })
        .subscribe({
          next: (data: any) => {
            // console.log(data);
            this.quiz = data.quiz;
            this.course = data.course;
            this.questions = this.quiz.questions;

            if (this.questions.length <= 1) {
              this.lastQuestion = true;
            }
            this.showQuestion = this.questions[this.questionIndex];
            this.questionType = this.showQuestion.queType;
            // console.log(this.showQuestion);

            if (this.questionType == 'coding') {
              (<FormArray>this.quizForm.get('questions')).push(
                new FormGroup({
                  code: new FormControl(),
                  language: new FormControl(),
                })
              );
            } else {
              (<FormArray>this.quizForm.get('questions')).push(
                new FormGroup({
                  option1: new FormControl(false),
                  option2: new FormControl(false),
                  option3: new FormControl(false),
                  option4: new FormControl(false),
                })
              );
            }
          },
          error: (err) => {},
        });
    });
  }
  ngOnInit(): void {
    this.userSubscription = this.storeService.loggedInUser$.subscribe({
      next: (data) => {
        this.user = data;
      },
      error: () => {},
    });
  }
  openModal() {
    this.resultModalInstance = this.modalService.open(this.resultModal, {
      size: 'lg',
      backdrop : 'static',
      keyboard : false
    });
  }
  closeModal() {
    this.resultModalInstance.close();
  }

  next() {
    if (!this.lastQuestion) {
      this.questionIndex += 1;
      this.showQuestion = this.questions[this.questionIndex];
      this.questionType = this.showQuestion.queType;
    }
    if (
      this.questionIndex >= (<FormArray>this.quizForm.get('questions')).length
    ) {
      // console.log('CONTROLS PUSHED', this.questionType);
      if (this.questionType == 'mcq' || this.questionType == 'truefalse') {
        (<FormArray>this.quizForm.get('questions')).push(
          new FormGroup({
            option1: new FormControl(false),
            option2: new FormControl(false),
            option3: new FormControl(false),
            option4: new FormControl(false),
          })
        );
      } else {
        (<FormArray>this.quizForm.get('questions')).push(
          new FormGroup({
            code: new FormControl(),
            language: new FormControl(),
          })
        );
      }
    }
    this.firstQuestion = false;
    // console.log(this.firstQuestion);
    if (this.questionIndex == this.questions.length - 1) {
      this.lastQuestion = true;
    }
  }
  previous() {
    if (!this.firstQuestion) {
      this.questionIndex -= 1;
      this.lastQuestion = false;
      this.showQuestion = this.questions[this.questionIndex];
      this.questionType = this.showQuestion.queType;
    }
    if (this.questionIndex == 0) {
      this.firstQuestion = true;
    }
  }
  nextPage() {
    let data = this.resultData;
    this.closeModal();
    if (data.next.nextType == 'lesson') {
      // console.log(data.next.nextContentId);
      this.router.navigate([
        '/lessons/' +
          this.courseId +
          '/' +
          data.next.nextModuleId +
          '/' +
          data.next.nextContentId,
      ]);
    } else if (data.next.nextType != -1) {
      this.router.navigate([
        'quizzes/quiz/' +
          data.next.nextType +
          '/' +
          this.courseId +
          '/' +
          data.next.nextModuleId +
          '/' +
          data.next.nextContentId,
      ]);
    } else {
      this.router.navigate(['/']);
    }
  }
  submit() {
    if (confirm('Are you sure you want to Submit?')) {
      this.answers = this.quizForm.value;
      // console.log(this.answers);
      this.apiService
        .submitQuiz({
          courseId: this.courseId,
          moduleId: this.moduleId,
          quizId: this.quizId,
          studentId: this.user._id,
          data: this.answers,
        })
        .subscribe({
          next: (data: any) => {
            // console.log(data);
            this.resultData = data;
            this.openModal();
            this.apiService
              .getStudentExp({ studentId: this.user._id })
              .subscribe({
                next: (data: any) => {
                  // console.log(data);
                  this.storeService.setExp(data.exp);
                },
                error: (err) => {
                  console.log(err);
                },
              });
            // this.nextPage(data);
          },
        });
    }
  }

  customrun(data: { code: string; input: string; language: string }) {
    this.apiService.runCustomCode(data).subscribe({
      next: (data) => {
        this.output = data.Output;
      },
    });
  }
}
