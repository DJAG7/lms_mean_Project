import {
  Component,
  Input,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-test-review',
  templateUrl: './test-review.component.html',
  styleUrls: ['./test-review.component.css'],
})
export class TestReviewComponent {
  tempPhoto = true;
  sectionIndex = 0;
  questionIndex = -1;
  sections: any = [];
  testForm: FormGroup;
  questionType: string;
  firstQuestion: boolean=true;
  lastQuestion: boolean=false;
  output: string = '';
  showQuestion: any;
  showCorrect: any;
  testData: any = {};
  constructor(
    private apiService: ApiService,
    private storeService: StoreService,
    private activatedRoute:ActivatedRoute,
    private router:Router,
  ) {}
  isExitPermissible = false;
  ngOnInit() {
    this.activatedRoute.params.subscribe(params=>{
      this.apiService.reviewTest(this.storeService?.user?._id,params?.['testId']).subscribe({
        next:(data=>{
          this.testData=data?.[0]?.testId;
            this.sections = this.testData?.sections;
            this.testForm = new FormGroup({
              sections: new FormArray([]),
            });
            this.sections.forEach((section: any,secInd:number) => {
              let sectionsForm = new FormGroup({ questions: new FormArray([]) });
              let submittedAns=data?.[0]?.submittedAnswers?.[secInd]?.questions;
              section.questions.forEach((que: any,queIndex:number) => {
                
                if (que.queType == 'coding') {
                  (sectionsForm.get('questions') as FormArray).push(
                    new FormGroup({
                      code: new FormControl(),
                      language: new FormControl(),
                    })
                  );
                }
               else {
                  (sectionsForm.get('questions') as FormArray).push(
                    new FormGroup({
                      option1: new FormControl(submittedAns?.[queIndex]?.option1),
                      option2: new FormControl(submittedAns?.[queIndex]?.option2),
                      option3: new FormControl(submittedAns?.[queIndex]?.option3),
                      option4: new FormControl(submittedAns?.[queIndex]?.option4),
                    })
                  );
                }
              });
              (this.testForm.get('sections') as FormArray).push(sectionsForm);
            });
            this.sectionForm.disable();
        }),
        error:(error)=>{
          this.router.navigate(['student/tests'])
          console.log(error);
        }
      })
    })
  }
  ngOnChanges() {}


  startSection() {
    this.questionIndex++;
    this.showQuestion =
      this.sections[this.sectionIndex]?.questions[this.questionIndex];
    this.questionType =
      this.sections[this.sectionIndex]?.questions[this.questionIndex]?.queType;
    this.showCorrect=this.correctOptionsTransformer(this.sections[this.sectionIndex]?.questions[this.questionIndex]?.correctOptions,this.sections[this.sectionIndex]?.questions[this.questionIndex]?.queType)
  }

  public get sectionForm() {
    return (this.testForm?.get('sections') as FormArray)?.at(
      this.sectionIndex
    ) as FormGroup;
  }

  previous() {
    if (this.questionIndex > 0) {
      this.questionIndex--;
      this.showQuestion =
        this.sections[this.sectionIndex]?.questions[this.questionIndex];
      this.questionType =
        this.sections[this.sectionIndex]?.questions[
          this.questionIndex
        ]?.queType;
      this.showCorrect=this.correctOptionsTransformer(this.sections[this.sectionIndex]?.questions[this.questionIndex]?.correctOptions,this.sections[this.sectionIndex]?.questions[this.questionIndex]?.queType)
      this.lastQuestion = false;
      this.firstQuestion = false;
    } else {
      if (this.questionIndex == -1) {
        this.sectionIndex > 0 && this.sectionIndex--;
        this.questionIndex =
          this.sections[this.sectionIndex]?.questions.length - 1;
        this.showQuestion =
          this.sections[this.sectionIndex]?.questions[this.questionIndex];
        this.questionType =
          this.sections[this.sectionIndex]?.questions[
            this.questionIndex
          ]?.queType;
        this.showCorrect=this.correctOptionsTransformer(this.sections[this.sectionIndex]?.questions[this.questionIndex]?.correctOptions,this.sections[this.sectionIndex]?.questions[this.questionIndex]?.queType)
        this.lastQuestion=false;
      } else {
        this.questionIndex = -1;
      }
      (this.sectionIndex == 0 && this.questionIndex==0) ? (this.firstQuestion = true):(this.firstQuestion = false);
    }

  }
  next() {
    if (
      this.questionIndex <
      this.sections[this.sectionIndex]?.questions.length - 1
    ) {
      this.questionIndex++;
      this.showQuestion =
        this.sections[this.sectionIndex]?.questions[this.questionIndex];
      this.questionType =
        this.sections[this.sectionIndex]?.questions[
          this.questionIndex
        ]?.queType;
    this.showCorrect=this.correctOptionsTransformer(this.sections[this.sectionIndex]?.questions[this.questionIndex]?.correctOptions,this.sections[this.sectionIndex]?.questions[this.questionIndex]?.queType)

      this.firstQuestion = false;
    } else {
      this.sectionIndex++;
      this.questionIndex = -1;
      if (this.sectionIndex == this.sections.length) {
        this.lastQuestion = true;
      }
      this.firstQuestion = false;
      this.showQuestion =
        this.sections[this.sectionIndex]?.questions[this.questionIndex];
      this.questionType =
        this.sections[this.sectionIndex]?.questions[
          this.questionIndex
        ]?.queType;
    this.showCorrect=this.correctOptionsTransformer(this.sections[this.sectionIndex]?.questions[this.questionIndex]?.correctOptions,this.sections[this.sectionIndex]?.questions[this.questionIndex]?.queType)
    }
  }

  navigateQuestion(secIndex: any, queIndex: any) {
    this.lastQuestion = false;
    this.firstQuestion = false;
    this.sectionIndex = secIndex;
    this.questionIndex = queIndex;
    if(this.sectionIndex == this.sections.length-1 && this.questionIndex ==   this.sections[this.sectionIndex]?.questions-1){
      this.lastQuestion = true;
      this.firstQuestion = false;
    }
    else if(this.sectionIndex == 0 && this.questionIndex == 0){
      this.lastQuestion = false;
      this.firstQuestion = true;
    }
    this.showQuestion =
      this.sections[this.sectionIndex]?.questions[this.questionIndex];
    this.questionType =
      this.sections[this.sectionIndex]?.questions[this.questionIndex]?.queType;
    this.showCorrect=this.correctOptionsTransformer(this.sections[this.sectionIndex]?.questions[this.questionIndex]?.correctOptions,this.sections[this.sectionIndex]?.questions[this.questionIndex]?.queType)

  }
  ngOnDestroy() {
  }
  checkHTML(data:string){
    let regexForHTML = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/;
    return regexForHTML.test(data);
  }
  correctOptionsTransformer(correctOptions:Array<any>,queType:string){
    if(queType==='truefalse'){
      return [correctOptions[0]];
    }
    else if(queType==='mcq'){
      return ['option '+correctOptions[0]];
    }
    else if(queType==='maq'){
      let dataToReturn:Array<any>=[];
      correctOptions.map((ele,index)=>(ele===true && dataToReturn.push('option '+(index+1))));
      return dataToReturn;
    }
    return [];
  }
}
