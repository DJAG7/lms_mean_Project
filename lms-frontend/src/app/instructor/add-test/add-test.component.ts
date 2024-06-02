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
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';
import { QuillComponent } from 'src/app/shared/quill/quill.component';
import { Module } from 'src/app/types/module.type';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { InstructorCommonServiceService } from '../instructor-common-service.service';

@Component({
  selector: 'app-add-test',
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.css'],
})
export class AddTestComponent {
  testForm: FormGroup;
  courseId: any = null;
  isEditing: boolean = false;
  editTestId: string = '';
  testData: any = {};
  editorStyle = {
    minHeight: '100px',
    backgroundColor: '#ffffff',
  };
  // @ViewChildren('quill') quill:any;
  constructor(
    private storeService: StoreService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private toastr: ToastrService,
    private instructorService: InstructorCommonServiceService
  ) {
    this.testForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      useCamera: new FormControl(false),
      testType: new FormControl('mock'),
      instructions: new FormControl('', [Validators.required]),
      length: new FormGroup({
        hours: new FormControl(0),
        minutes: new FormControl(0),
      }),
      sections: new FormArray([
        new FormGroup({
          name: new FormControl('', [Validators.required]),
          description: new FormControl(''),
          questionsInputType: new FormControl('form'),
          questionsLink: new FormControl(null),
          questions: new FormArray([
            new FormGroup({
              queType: new FormControl('maq', [Validators.required]),
              questionTitleType: new FormControl('text', [Validators.required]),
              questionTitle: new FormControl('', [Validators.required]),
              questionDescripton: new FormControl(''),
              option1: new FormControl('', [Validators.required]),
              option2: new FormControl('', [Validators.required]),
              option3: new FormControl(''),
              option4: new FormControl(''),
              option1Correct: new FormControl(false),
              option2Correct: new FormControl(false),
              option3Correct: new FormControl(false),
              option4Correct: new FormControl(false),
              inputTestCases: new FormControl(''),
              sampleTestCases: new FormControl(''),
              // outputTestCases:new FormControl(''),
            }),
          ]),
        }),
      ]),
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((data: any) => {
      if (data.testId) {
        this.isEditing = true;
        this.editTestId = data.testId;
        this.apiService
          .getTestById(
            this.storeService.role,
            this.editTestId,
            this.storeService.user._id
          )
          .subscribe({
            next: (testDataRes) => {
              this.testData = testDataRes.tests[0];
              let sectionFormArray = new FormArray([]);
              this.testData.sections.forEach((sectionData: any) => {
                // console.log(sectionData);
                let questionsFormArray = new FormArray([]);
                sectionData.questions.map((question: any) => {
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
                sectionData.questions.forEach((que: any) => {
                  questionsFormArray.push(this.patchQuestionDataOnInit(que));
                });
                let sectionForm = new FormGroup({
                  _id: new FormControl(sectionData._id),
                  name: new FormControl(sectionData.name, [
                    Validators.required,
                  ]),
                  description: new FormControl(sectionData.description),
                  questionsInputType: new FormControl('form'),
                  questionsLink: new FormControl(null),
                  questions: questionsFormArray,
                });
                sectionFormArray.push(sectionForm);
              });
              this.testForm = new FormGroup({
                _id: new FormControl(this.editTestId),
                name: new FormControl(this.testData.name, [
                  Validators.required,
                ]),
                description: new FormControl(this.testData.description, [
                  Validators.required,
                ]),
                useCamera: new FormControl(
                  this.testData?.useCamera ? this.testData.useCamera : false
                ),
                testType: new FormControl(
                  this.testData?.testType ? this.testData.testType : 'mock'
                ),
                instructions: new FormControl(this.testData?.instructions, [
                  Validators.required,
                ]),
                length: new FormGroup({
                  hours: new FormControl(this.testData.length.hours),
                  minutes: new FormControl(this.testData.length.minutes),
                }),
                sections: sectionFormArray,
              });
            },
            error: (error) => {
              console.log('ERROR', error);
              this.router.navigate(['instructor', 'tests']);
            },
          });
        this.testForm.valueChanges.subscribe((data) => {
          // console.log(data);
        });
      } else {
        this.isEditing = false;
        this.testForm = new FormGroup({
          name: new FormControl('', [Validators.required]),
          description: new FormControl('', [Validators.required]),
          useCamera: new FormControl(false),
          testType: new FormControl('mock'),
          instructions: new FormControl('', [Validators.required]),
          length: new FormGroup({
            hours: new FormControl(0),
            minutes: new FormControl(0),
          }),
          sections: new FormArray([
            new FormGroup({
              name: new FormControl('', [Validators.required]),
              description: new FormControl(''),
              questionsInputType: new FormControl('form'),
              questionsLink: new FormControl(null),
              questions: new FormArray([
                new FormGroup({
                  queType: new FormControl('maq', [Validators.required]),
                  questionTitleType: new FormControl('text', [
                    Validators.required,
                  ]),
                  questionTitle: new FormControl('', [Validators.required]),
                  questionDescripton: new FormControl(''),
                  option1: new FormControl('', [Validators.required]),
                  option2: new FormControl('', [Validators.required]),
                  option3: new FormControl(''),
                  option4: new FormControl(''),
                  option1Correct: new FormControl(false),
                  option2Correct: new FormControl(false),
                  option3Correct: new FormControl(false),
                  option4Correct: new FormControl(false),
                  inputTestCases: new FormControl(''),
                  sampleTestCases: new FormControl(''),
                  // outputTestCases:new FormControl(''),
                }),
              ]),
            }),
          ]),
        });
        this.testForm.valueChanges.subscribe((data) => {
          // console.log(data);
        });
      }
    });
  }
  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  getSectionsControls() {
    return (<FormArray>this.testForm.get('sections')).controls;
  }

  getQuestionsControls(line: any) {
    return (<FormArray>line.get('questions')).controls;
  }
  addSection() {
    let sectionCtrl = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      questionsInputType: new FormControl('form'),
      questionsLink: new FormControl(null),
      questions: new FormArray([
        new FormGroup({
          queType: new FormControl('maq', [Validators.required]),
          questionTitleType: new FormControl('text', [Validators.required]),
          questionTitle: new FormControl('', [Validators.required]),
          questionDescripton: new FormControl(''),
          option1: new FormControl('', [Validators.required]),
          option2: new FormControl('', [Validators.required]),
          option3: new FormControl(''),
          option4: new FormControl(''),
          option1Correct: new FormControl(false),
          option2Correct: new FormControl(false),
          option3Correct: new FormControl(false),
          option4Correct: new FormControl(false),
          inputTestCases: new FormControl(''),
          sampleTestCases: new FormControl(''),
          // outputTestCases:new FormControl(''),
        }),
      ]),
    });
    (this.testForm.get('sections') as FormArray).push(sectionCtrl);
  }
  addQuestion(line: any) {
    let questionCtrl = new FormGroup({
      queType: new FormControl('maq'),
      questionTitleType: new FormControl('text', [Validators.required]),
      questionTitle: new FormControl(''),
      questionDescripton: new FormControl(''),
      option1: new FormControl('', [Validators.required]),
      option2: new FormControl('', [Validators.required]),
      option3: new FormControl(''),
      option4: new FormControl(''),
      option1Correct: new FormControl(false),
      option2Correct: new FormControl(false),
      option3Correct: new FormControl(false),
      option4Correct: new FormControl(false),
      inputTestCases: new FormControl(''),
      sampleTestCases: new FormControl(''),
      // outputTestCases:new FormControl(''),
    });
    (<FormArray>line.get('questions')).push(questionCtrl);
  }

  deleteSection(i: number) {
    (this.testForm.get('sections') as FormArray).removeAt(i);
  }
  deleteQuestion(questionCtrls: any, ind: number) {
    (questionCtrls.get('questions') as FormArray).removeAt(ind);
  }
  isValid() {
    return this.testForm.valid;
  }
  addUpdateTest() {
    // console.log(this.testForm);
    let formData: any = this.testForm.value;
    // console.log(formData);
    if (!this.isEditing) {
      this.apiService.addTest(this.storeService.user._id, formData).subscribe({
        next: (data) => {
          this.toastr.success(data.message);
          this.router.navigate(['instructor', 'tests']);
        },
        error: (err) => {
          // this.toastr.error(err.message);
        },
      });
    } else {
      this.apiService.editTest(this.storeService.user._id, formData).subscribe({
        next: (data) => {
          this.toastr.success(data.message);
          this.router.navigate(['instructor', 'tests']);
        },
        error: (err) => {
          // this.toastr.error(err.message);
        },
      });
    }
  }
  getFormControl(control: any) {
    return control as FormControl;
  }
  getFormArray(control: any) {
    return control as FormArray;
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
      // ctrls.get('option3').setValidators([Validators.required]);
      // ctrls.get('option4').setValidators([Validators.required]);
      ctrls.get('option1Correct').setValidators([Validators.required]);
      ctrls.get('option2Correct').setValidators([Validators.required]);
      ctrls.get('option3Correct').setValidators([Validators.required]);
      ctrls.get('option4Correct').setValidators([Validators.required]);
      ctrls.get('inputTestCases').clearValidators();
    } else if (ctrls.value.queType == 'mcq') {
      ctrls.get('option1').setValidators([Validators.required]);
      ctrls.get('option2').setValidators([Validators.required]);
      // ctrls.get('option3').setValidators([Validators.required]);
      // ctrls.get('option4').setValidators([Validators.required]);
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
  changeQuestionInputType(sectionCtrl: any) {
    if (sectionCtrl.value.questionsInputType == 'excel') {
      sectionCtrl.get('questionsLink').clearValidators();
      sectionCtrl.get('questions').clear();
      sectionCtrl.get('questions').updateValueAndValidity();
      sectionCtrl.get('questionsLink').setValidators([Validators.required]);
      sectionCtrl.get('questionsLink').updateValueAndValidity();
    } else {
      sectionCtrl.get('questionsLink').clearValidators();
      sectionCtrl.get('questionsLink').updateValueAndValidity();
      sectionCtrl.get('questions').clearValidators();
      this.addQuestion(sectionCtrl);
      sectionCtrl.get('questions').updateValueAndValidity();
    }
  }

  patchQuestionDataOnInit(ele: any) {
    if (ele.queType === 'maq') {
      return new FormGroup({
        _id: new FormControl(ele._id),
        queType: new FormControl(ele.queType, [Validators.required]),
        questionTitleType: new FormControl('text'),
        questionTitle: new FormControl(ele.questionTitle, [
          Validators.required,
        ]),
        questionDescripton: new FormControl(ele.questionDescripton),
        option1: new FormControl(ele.option1, [Validators.required]),
        option2: new FormControl(ele.option2, [Validators.required]),
        option3: new FormControl(ele.option3),
        option4: new FormControl(ele.option4),
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
        option4Correct: new FormControl(
          ele.option4Correct ? ele.option4Correct : false,
          [Validators.required]
        ),
        inputTestCases: new FormControl(''),
      });
    } else if (ele.queType === 'mcq') {
      return new FormGroup({
        _id: new FormControl(ele._id),
        queType: new FormControl(ele.queType, [Validators.required]),
        questionTitleType: new FormControl('text'),
        questionTitle: new FormControl(ele.questionTitle, [
          Validators.required,
        ]),
        questionDescripton: new FormControl(ele.questionDescripton),
        option1: new FormControl(ele.option1, [Validators.required]),
        option2: new FormControl(ele.option2, [Validators.required]),
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
    } else if (ele.queType === 'truefalse') {
      return new FormGroup({
        _id: new FormControl(ele._id),
        queType: new FormControl(ele.queType, [Validators.required]),
        questionTitleType: new FormControl('text'),
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
        questionTitleType: new FormControl('text'),
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
        sampleTestCases: new FormControl(ele.sampleTestCases ? ele.sampleTestCases : null ),
        outputTestCases: new FormControl(ele.outputTestCases),
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

  drop(event: CdkDragDrop<any>, formArr: FormArray) {
    const from = event.previousIndex;
    const to = event.currentIndex;
    this.instructorService.moveItemInFormArray(formArr, from, to);
  }
}
