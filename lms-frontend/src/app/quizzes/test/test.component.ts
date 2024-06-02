import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { retry } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent {
  permissionProvided: boolean = false;
  testId: string = '';
  testSummary: any = {};
  testData: any = {};
  isTestStarted = false;
  resultData: any;
  @ViewChild('resultModal') resultModal: TemplateRef<any>;
  resultModalInstance: any;
  constructor(
    private apiService: ApiService,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}
  async ngOnInit() {
    this.activatedRoute.params.subscribe((data: any) => {
      // console.log(data);
      this.testId = data.testId;
      this.apiService
        .getTestSummaryById(
          this.storeService.role,
          this.testId,
          this.storeService.user._id
        )
        .subscribe({
          next: (testData) => {
            this.testSummary = testData.tests?.[0];
            // console.log(this.testSummary);
          },
          error: (err) => {
            this.router.navigate(['']);
          },
        });
    });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      this.permissionProvided = true;
      console.log('Permissions granted!');
      // Do something with the stream
    } catch (error) {
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        console.log(
          this.testData,
          this.permissionProvided,
          'Permissions denied!'
        );
      } else {
        console.log('Error:', error);
      }
    }
  }

  startTest() {
    this.apiService
      .startTest(
        this.storeService.role,
        this.testId,
        this.storeService.user._id
      )
      .subscribe({
        next: (testData) => {
          this.testData = testData.tests?.[0];
          this.isTestStarted = true;
        },
        error: (err) => {
          this.router.navigate(['']);
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
  submitTest(answers: any) {
    let payload = {
      testId: this.testId,
      student: this.storeService.user._id,
      answers: answers,
    };
    this.apiService
      .submitTest(payload)
      .pipe(retry(3))
      .subscribe({
        next: (data) => {
          this.resultData = data;
          this.resultData.sectionwiseScore = this.processSectionWiseScore(
            this.resultData.sectionwiseScore
          );
          this.toastr.success('Test Submitted Successfully');
          console.log('SUCCESSFULLY SUBMITTED');
          if (this.testData.testType == 'mock') this.openModal();
          if (this.testData.testType != 'mock')
            this.router.navigate(['student/tests']);
        },
        error: (error) => {
          this.toastr.success('Something went wrong');
        },
      });
  }
  openModal() {
    this.resultModalInstance = this.modalService.open(this.resultModal, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
  closeModal() {
    this.resultModalInstance.close();
  }
  nextPage() {
    this.closeModal();
    this.router.navigate(['student/tests']);
  }
  showReview() {
    this.resultModalInstance.close();
    this.router.navigate([
      'reports/student',
      this.resultData.test.enrolledTestId,
    ]);
  }
}
