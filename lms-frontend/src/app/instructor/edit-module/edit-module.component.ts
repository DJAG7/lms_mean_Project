import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component,ViewChildren ,ElementRef,ChangeDetectorRef} from '@angular/core';
import { FormControl, FormGroup,FormArray,Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';
import { QuillComponent } from 'src/app/shared/quill/quill.component';
import { Module } from 'src/app/types/module.type';
import { InstructorCommonServiceService } from '../instructor-common-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-module',
  templateUrl: './edit-module.component.html',
  styleUrls: ['./edit-module.component.css']
})
export class EditModuleComponent {
  courseId: any = '';
  moduleId: any = '';
  courseModules: any = [];
  curModule: any = [];
  moduleForm: FormGroup;
  editorStyle = {
    minHeight: '100px',
    backgroundColor: '#ffffff',
  };
  routerEvents:Subscription;
  // @ViewChildren('quill') quill:any;
  constructor(
    private storeService: StoreService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private instructorService:InstructorCommonServiceService
  ) {
    this.moduleForm = new FormGroup({
      _id: new FormControl(''),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      lessons: new FormArray([]),
    });
  }

  ngOnInit() {
    this.routerEvents=this.router.events.subscribe((val) => {
      if(val instanceof NavigationStart){
        if(!val.url.includes('edit')){
          this.storeService.resetCourse();
        }
      }
  });
    // if(this.storeService.courseData.name===''){
    //   alert("Please fill basic course details");
    //   this.router.navigate(['instructor','add-course'])
    // }
    this.activatedRoute.params.subscribe((data: any) => {
      this.courseId = data.courseid;
      this.moduleId = data.moduleid;
      console.warn(this.storeService?.courseData, this.courseId);

      if (this.storeService?.courseData?._id == this.courseId) {
        this.curModule = this.storeService?.courseData?.modules[+this.moduleId];
        this.initForm();
      } else {
        this.storeService.getInstructorCourse(this.courseId).subscribe({
          next: (data) => {
            this.storeService.setPrimaryCourseData({
              name: data.course.name,
              description: data.course.description,
              difficulty: data.course.difficulty,
              price: data.course.price,
              tags: data.course.tags,
              thumbnail: data.course.thumbnail,
              trailer: data.course.trailer,
              _id: data.course._id,
            });
            this.courseModules = data.course.modules;
            this.courseModules.map((module: any) => {
              module.content.map((content: any) => {
                if (content.type !== 'lesson') {
                  // console.log(content);
                  content.questions.map((question: any) => {
                    if (question.queType !== 'coding') {
                      question.option1 = question.options[0];
                      question.option2 = question.options[1];
                      question.option3 = question.options[2];
                      question.option4 = question.options[3];
                      question.option1Correct = question.correctOptions[0];
                      question.option2Correct = question.correctOptions[1];
                      question.option3Correct = question.correctOptions[2];
                      question.option4Correct = question.correctOptions[3];
                    }
                  });
                }
              });
              module.lessons = module.content;
              delete module.content;
            });
            // console.log(this.courseModules);

            let formData = data.course;
            this.courseModules.forEach((ele: any) => {
              this.storeService.addModule(ele);
            });
            this.curModule = this.courseModules[+this.moduleId];
            // this.curModule=this.storeService?.courseData?.modules[+this.moduleId];
            // console.log("CUR MODULE",this.curModule);
            this.initForm();
          },
        });
      }
    });
  }
  initForm() {
    this.moduleForm.patchValue({
      _id: this.curModule['_id'],
      name: this.curModule['name'],
      description: this.curModule['description'],
    });
    for (let i = 0; i < this.curModule.lessons.length; i++) {
      let content = this.curModule.lessons[i];
      if (content.type == 'lesson') {
        let lessonCtrl = new FormGroup({
          _id: new FormControl(content._id),
          type: new FormControl('lesson'),
          name: new FormControl(content.name, [Validators.required]),
          description: new FormControl(content.description),
          content: new FormGroup({
            contentType: new FormControl(content.content.contentType),
            contentData: new FormControl(content.content.contentData, [
              Validators.required,
            ]),
          }),
          length: new FormGroup({
            hour: new FormControl(content.length.hour),
            minutes: new FormControl(content.length.minutes),
          }),
        });
        (this.moduleForm.get('lessons') as FormArray).push(lessonCtrl);
      } else {
        let quizCtrl = new FormGroup({
          _id: new FormControl(content._id),
          type: new FormControl(content.type),
          name: new FormControl(content.name, [Validators.required]),
          description: new FormControl(content.description),
          length: new FormGroup({
            hour: new FormControl(content.length.hour),
            minutes: new FormControl(content.length.minutes),
          }),
          questions: new FormArray([]),
        });
        content.questions.forEach((ele: any) => {
          (quizCtrl.get('questions') as FormArray).push(
            this.patchQuestionDataOnInit(ele)
          );
        });
        (this.moduleForm.get('lessons') as FormArray).push(quizCtrl);
      }
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
      _id: new FormControl(''),
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
      _id: new FormControl(''),
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
      _id: new FormControl(''),
      type: new FormControl(type),
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      length: new FormGroup({
        hour: new FormControl(0),
        minutes: new FormControl(0),
      }),
      questions: new FormArray([
        new FormGroup({
          _id: new FormControl(''),
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
    let formData: Module = this.moduleForm.value;
    if (this.storeService.courseData) {
      this.storeService.courseData.modules[this.moduleId] = formData;
    }
    this.router.navigate(['instructor', 'edit', this.courseId]);
  }
  getFormControl(control: any) {
    return control as FormControl;
  }

  patchQuestionDataOnInit(ele: any) {
    if (ele.queType === 'maq') {
      return new FormGroup({
        _id: new FormControl(ele._id),
        queType: new FormControl(ele.queType, [Validators.required]),
        questionTitle: new FormControl(ele.questionTitle, [
          Validators.required,
        ]),
        questionDescripton: new FormControl(ele.questionDescripton),
        option1: new FormControl(ele.option1, [Validators.required]),
        option2: new FormControl(ele.option2, [Validators.required]),
        option3: new FormControl(ele.option3, [Validators.required]),
        option4: new FormControl(ele.option4, [Validators.required]),
        option1Correct: new FormControl(
          ele.option1Correct ? ele.option1Correct : false,
          [Validators.required]
        ),
        option2Correct: new FormControl(
          ele.option2Correct ? ele.option2Correct : false,
          [Validators.required]
        ),
        option3Correct: new FormControl(
          ele.option3Correct ? ele.option3Correct : false,
          [Validators.required]
        ),
        option4Correct: new FormControl(ele.option4Correct, [
          Validators.required,
        ]),
        inputTestCases: new FormControl(''),
      });
    } else if (ele.queType === 'mcq') {
      return new FormGroup({
        _id: new FormControl(ele._id),
        queType: new FormControl(ele.queType, [Validators.required]),
        questionTitle: new FormControl(ele.questionTitle, [
          Validators.required,
        ]),
        questionDescripton: new FormControl(ele.questionDescripton),
        option1: new FormControl(ele.option1, [Validators.required]),
        option2: new FormControl(ele.option2, [Validators.required]),
        option3: new FormControl(ele.option3, [Validators.required]),
        option4: new FormControl(ele.option4, [Validators.required]),
        option1Correct: new FormControl(ele.option1Correct, [
          Validators.required,
        ]),
        option2Correct: new FormControl(ele.option2Correct),
        option3Correct: new FormControl(ele.option3Correct),
        option4Correct: new FormControl(ele.option4Correct),
        inputTestCases: new FormControl(''),
      });
    } else if (ele.queType === 'truefalse') {
      return new FormGroup({
        _id: new FormControl(ele._id),
        queType: new FormControl(ele.queType, [Validators.required]),
        questionTitle: new FormControl(ele.questionTitle, [
          Validators.required,
        ]),
        questionDescripton: new FormControl(ele.questionDescripton),
        option1: new FormControl(ele.option1),
        option2: new FormControl(ele.option2),
        option3: new FormControl(ele.option3),
        option4: new FormControl(ele.option4),
        option1Correct: new FormControl(ele.option1Correct, [
          Validators.required,
        ]),
        option2Correct: new FormControl(ele.option2Correct),
        option3Correct: new FormControl(ele.option3Correct),
        option4Correct: new FormControl(ele.option4Correct),
        inputTestCases: new FormControl(''),
      });
    } else if (ele.queType === 'coding') {
      return new FormGroup({
        _id: new FormControl(ele._id),
        queType: new FormControl(ele.queType, [Validators.required]),
        questionTitle: new FormControl(ele.questionTitle, [
          Validators.required,
        ]),
        questionDescripton: new FormControl(ele.questionDescripton),
        option1: new FormControl(''),
        option2: new FormControl(''),
        option3: new FormControl(''),
        option4: new FormControl(''),
        option1Correct: new FormControl(false),
        option2Correct: new FormControl(false),
        option3Correct: new FormControl(false),
        option4Correct: new FormControl(false),
        inputTestCases: new FormControl(ele.inputTestCases, [
          Validators.required,
        ]),
      });
    }

    return new FormGroup({
      _id: new FormControl(),
      queType: new FormControl(),
      questionTitle: new FormControl(),
      questionDescripton: new FormControl(),
      option1: new FormControl(''),
      option2: new FormControl(''),
      option3: new FormControl(''),
      option4: new FormControl(''),
      option1Correct: new FormControl(false),
      option2Correct: new FormControl(false),
      option3Correct: new FormControl(false),
      option4Correct: new FormControl(false),
      inputTestCases: new FormControl(),
    });
  }
  questionValidationsChange(ctrls: any) {
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
    // moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
    const from = event.previousIndex;
    const to = event.currentIndex;
    this.instructorService.moveItemInFormArray(formArr, from, to)
  }
  ngOnDestroy(){
    this.routerEvents.unsubscribe();
  }
}
