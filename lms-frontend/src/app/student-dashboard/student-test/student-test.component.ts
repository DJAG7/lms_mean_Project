import { Component, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-student-test',
  templateUrl: './student-test.component.html',
  styleUrls: ['./student-test.component.css'],
})
export class StudentTestComponent {
  tests: any = [];
  resultModalInstance: any;
  resultData: any;
  resultIndex: number;
  constructor(
    private router: Router,
    private storeService: StoreService,
    private apiService: ApiService,
    private modalService: NgbModal
  ) {}
  ngOnInit() {
    this.apiService.getStudentTest(this.storeService.user._id).subscribe({
      next: (data) => {
        // console.log(data);
        this.tests = data.tests;
      },
    });
  }
  processSectionWiseScore(sectionwiseScore: any) {
    let categories = sectionwiseScore.map((item: any) => item.name);
    let correctScore = sectionwiseScore.map((item: any) => item.correct);
    let incorrectScore = sectionwiseScore.map((item: any) => item.incorrect);
    return {
      categories,
      correctScore,
      incorrectScore,
    };
  }
  showResult(modal: TemplateRef<any>, i: number) {
    this.resultModalInstance = this.modalService.open(modal, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    this.resultData = {
      totalQuestions: this.tests[i].score.correct + this.tests[i].score.wrong,
      totalCorrect: this.tests[i].score.correct,
      test: this.tests[i],
      sectionwiseScore: this.processSectionWiseScore(
        this.tests[i].sectionwiseScore
      ),
    };
  }
  closeResult() {
    this.resultModalInstance.close();
  }
  redirectToAddTest() {
    this.router.navigate(['instructor', 'add-test']);
  }

  showReview() {
    this.resultModalInstance.close();
    this.router.navigate([
      'reports/student',
      this.resultData.test.enrolledTestId,
    ]);
  }
}
