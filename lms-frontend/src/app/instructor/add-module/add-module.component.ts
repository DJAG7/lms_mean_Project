import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  Component,
  ViewChildren,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormArray,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { QuillComponent } from 'src/app/shared/quill/quill.component';
import { Module } from 'src/app/types/module.type';
import { InstructorCommonServiceService } from '../instructor-common-service.service';

@Component({
  selector: 'app-add-module',
  templateUrl: './add-module.component.html',
  styleUrls: ['./add-module.component.css'],
})
export class AddModuleComponent {
  moduleForm: FormGroup;
  courseId: any = null;
  editorStyle = {
    minHeight: '100px',
    backgroundColor: '#ffffff',
  };
  // @ViewChildren('quill') quill:any;
  constructor(
    private storeService: StoreService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private instructorService:InstructorCommonServiceService
  ) {
    this.moduleForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      lessons: new FormArray([
        new FormGroup({
          type: new FormControl('lesson'),
          name: new FormControl('', [Validators.required]),
          description: new FormControl(''),
          content: new FormGroup({
            contentType: new FormControl('video'),
            contentData: new FormControl('', [Validators.required]),
          }),
          length: new FormGroup({
            hour: new FormControl(0),
            minutes: new FormControl(0),
          }),
        }),
      ]),
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((data: any) => {
      if (data.courseid) {
        this.courseId = data.courseid;

        let courseData = this.storeService.courseData;
        // console.log(courseData,courseData._id);
        if (courseData._id != this.courseId) {
          // console.log('Not equl', courseData.id, this.courseId);
          this.router.navigate(['instructor', 'edit', this.courseId]);
        }
      }
    });
    if(this.storeService.courseData.name===''){
      // alert("Please fill basic course details");
      // this.router.navigate(['instructor','add-course'])
    }
  }
  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }
  getLessonControls() {
    return (<FormArray>this.moduleForm.get('lessons')).controls;
  }

  getQuestionsControls(line: any) {
    return (<FormArray>line.get('questions')).controls;
  }

  addLesson() {
    let lessonCtrl = new FormGroup({
      type: new FormControl('lesson'),
      name: new FormControl(' ', [Validators.required]),
      description: new FormControl(''),
      content: new FormGroup({
        contentType: new FormControl('video'),
        contentData: new FormControl(' ', [Validators.required]),
      }),
      length: new FormGroup({
        hour: new FormControl(0),
        minutes: new FormControl(0),
      }),
    });
    (this.moduleForm.get('lessons') as FormArray).push(lessonCtrl);
  }
  addQuestion(line: any) {
    let questionCtrl = new FormGroup({
      queType: new FormControl('maq'),
      questionTitle: new FormControl(''),
      questionDescripton: new FormControl(''),
      option1: new FormControl('', [Validators.required]),
      option2: new FormControl('', [Validators.required]),
      option3: new FormControl('', [Validators.required]),
      option4: new FormControl('', [Validators.required]),
      option1Correct: new FormControl(false),
      option2Correct: new FormControl(false),
      option3Correct: new FormControl(false),
      option4Correct: new FormControl(false),
      inputTestCases: new FormControl(''),
      // outputTestCases:new FormControl(''),
    });
    (<FormArray>line.get('questions')).push(questionCtrl);
  }

  addQuiz(type: string) {
    let quizCtrl = new FormGroup({
      type: new FormControl(type),
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      length: new FormGroup({
        hour: new FormControl(0),
        minutes: new FormControl(0),
      }),
      questions: new FormArray([
        new FormGroup({
          queType: new FormControl('maq', [Validators.required]),
          questionTitle: new FormControl('', [Validators.required]),
          questionDescripton: new FormControl(''),
          option1: new FormControl('', [Validators.required]),
          option2: new FormControl('', [Validators.required]),
          option3: new FormControl('', [Validators.required]),
          option4: new FormControl('', [Validators.required]),
          option1Correct: new FormControl(false),
          option2Correct: new FormControl(false),
          option3Correct: new FormControl(false),
          option4Correct: new FormControl(false),
          inputTestCases: new FormControl(''),
          // outputTestCases:new FormControl(''),
        }),
      ]),
    });
    (this.moduleForm.get('lessons') as FormArray).push(quizCtrl);
  }

  deleteLesson(i: number) {
    (this.moduleForm.get('lessons') as FormArray).removeAt(i);
  }
  deleteQuestion(questionCtrls:any ,ind: number) {
    (questionCtrls.get('questions') as FormArray).removeAt(ind);
  }
  isValid() {
    return this.moduleForm.valid;
  }
  addModule() {
    // console.log(this.moduleForm);
    let formData: Module = this.moduleForm.value;
    this.storeService.addModule(formData);
    if (this.courseId) {
      this.router.navigate(['instructor', 'edit', this.courseId]);
    } else this.router.navigate(['instructor', 'add-course']);
  }
  getFormControl(control: any) {
    return control as FormControl;
  }

  questionValidationsChange(ctrls: any) {
    // console.log('LGOSSS', ctrls.value.queType);
    ctrls.get('option1').clearValidators();
    ctrls.get('option2').clearValidators();
    ctrls.get('option3').clearValidators();
    ctrls.get('option4').clearValidators();
    ctrls.get('option1Correct').clearValidators();
    ctrls.get('option2Correct').clearValidators();
    ctrls.get('option3Correct').clearValidators();
    ctrls.get('option4Correct').clearValidators();
    ctrls.get('inputTestCases').clearValidators();
    ctrls.get('option1Correct').reset();
    ctrls.get('option2Correct').reset();
    ctrls.get('option3Correct').reset();
    ctrls.get('option4Correct').reset();
    if (ctrls.value.queType == 'maq') {
      ctrls.get('option1Correct').setValue(false);
      ctrls.get('option2Correct').setValue(false);
      ctrls.get('option3Correct').setValue(false);
      ctrls.get('option4Correct').setValue(false);
      ctrls.get('option1').setValidators([Validators.required]);
      ctrls.get('option2').setValidators([Validators.required]);
      ctrls.get('option3').setValidators([Validators.required]);
      ctrls.get('option4').setValidators([Validators.required]);
      ctrls.get('option1Correct').setValidators([Validators.required]);
      ctrls.get('option2Correct').setValidators([Validators.required]);
      ctrls.get('option3Correct').setValidators([Validators.required]);
      ctrls.get('option4Correct').setValidators([Validators.required]);
      ctrls.get('inputTestCases').clearValidators();
    } else if (ctrls.value.queType == 'mcq') {
      ctrls.get('option1').setValidators([Validators.required]);
      ctrls.get('option2').setValidators([Validators.required]);
      ctrls.get('option3').setValidators([Validators.required]);
      ctrls.get('option4').setValidators([Validators.required]);
      ctrls.get('option1Correct').setValidators([Validators.required]);
      ctrls.get('option2Correct').clearValidators();
      ctrls.get('option3Correct').clearValidators();
      ctrls.get('option4Correct').clearValidators();
      ctrls.get('inputTestCases').clearValidators();
    } else if (ctrls.value.queType == 'coding') {
      ctrls.get('option1').clearValidators();
      ctrls.get('option2').clearValidators();
      ctrls.get('option3').clearValidators();
      ctrls.get('option4').clearValidators();
      ctrls.get('option1Correct').clearValidators();
      ctrls.get('option2Correct').clearValidators();
      ctrls.get('option3Correct').clearValidators();
      ctrls.get('option4Correct').clearValidators();
      ctrls.get('inputTestCases').setValidators([Validators.required]);
    } else if (ctrls.value.queType == 'truefalse') {
      ctrls.get('option1').clearValidators();
      ctrls.get('option2').clearValidators();
      ctrls.get('option3').clearValidators();
      ctrls.get('option4').clearValidators();
      ctrls.get('option1Correct').setValidators([Validators.required]);
      ctrls.get('option2Correct').clearValidators();
      ctrls.get('option3Correct').clearValidators();
      ctrls.get('option4Correct').clearValidators();
      ctrls.get('inputTestCases').clearValidators();
    }
    ctrls.get('option1').updateValueAndValidity();
    ctrls.get('option2').updateValueAndValidity();
    ctrls.get('option3').updateValueAndValidity();
    ctrls.get('option4').updateValueAndValidity();
    ctrls.get('option1Correct').updateValueAndValidity();
    ctrls.get('option2Correct').updateValueAndValidity();
    ctrls.get('option3Correct').updateValueAndValidity();
    ctrls.get('option4Correct').updateValueAndValidity();
    ctrls.get('inputTestCases').updateValueAndValidity();
  }
  getFormArray(control: any) {
    return control as FormArray;
  }
  drop(event: CdkDragDrop<any>,formArr:FormArray) {
    const from = event.previousIndex;
    const to = event.currentIndex;
    this.instructorService.moveItemInFormArray(formArr, from, to)
  }
}
