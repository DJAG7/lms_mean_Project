import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-student-report',
  templateUrl: './student-report.component.html',
  styleUrls: ['./student-report.component.css'],
})
export class StudentReportComponent {
  data: any;
  resultData: any;

  sections: any;
  testForm: any;
  testData: any;
  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.activatedRoute.params.subscribe((params: any) => {
      this.apiService.getTestReport(params.enrollid).subscribe({
        next: (data: any) => {
          this.data = data;
          this.testData = data?.test;
          this.sections = this.testData?.sections;
          this.resultData = { ...data?.resultData, test: data?.test };
          console.log(this.resultData);
          this.testForm = new FormGroup({
            sections: new FormArray([]),
          });
          this.sections.forEach((section: any, secInd: number) => {
            let sectionsForm = new FormGroup({
              questions: new FormArray([]),
            });
            let submittedAns = data?.submittedAnswers?.[secInd]?.questions;
            section.questions.forEach((que: any, queIndex: number) => {
              if (que.queType == 'coding') {
                (sectionsForm.get('questions') as FormArray).push(
                  new FormGroup({
                    code: new FormControl(),
                    language: new FormControl(),
                  })
                );
              } else {
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
          // this.testForm.disable();
        },
        error: (error: any) => {
          this.router.navigate(['student/tests']);
          console.log(error);
        },
      });
    });
  }
  getsectionForm(index: any) {
    return (this.testForm?.get('sections') as FormArray)?.at(
      index
    ) as FormGroup;
  }
  checkHTML(data: string) {
    let regexForHTML = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/;
    return regexForHTML.test(data);
  }
  getCorrect(secIndex: any, queIndex: any) {
    return this.correctOptionsTransformer(
      this.sections[secIndex]?.questions[queIndex]?.correctOptions,
      this.sections[secIndex]?.questions[queIndex]?.queType
    );
  }
  getCode(secIndex: any, queIndex: any) {
    return this.data?.submittedAnswers?.[secIndex]?.questions[queIndex].code;
  }
  correctOptionsTransformer(correctOptions: Array<any>, queType: string) {
    if (queType === 'truefalse') {
      return [correctOptions[0]];
    } else if (queType === 'mcq') {
      return ['option ' + correctOptions[0]];
    } else if (queType === 'maq') {
      let dataToReturn: Array<any> = [];
      correctOptions.map(
        (ele, index) =>
          ele === true && dataToReturn.push('option ' + (index + 1))
      );
      return dataToReturn;
    }
    return [];
  }
}
