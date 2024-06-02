import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { interval, Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-test-full-scr',
  templateUrl: './test-full-scr.component.html',
  styleUrls: ['./test-full-scr.component.css'],
})
export class TestFullScrComponent {
  tempPhoto = true;
  sectionIndex = 0;
  questionIndex = -1;
  sections: any = [];
  testForm: FormGroup;
  questionType: string;
  firstQuestion: boolean;
  lastQuestion: boolean;
  output: string = '';
  showQuestion: any;
  showSampleTestCasesResult: boolean = false;
  sampleTestCaseResult: any;
  showSampleTestCaseLoader: boolean = false;
  codeMode: boolean = false;
  @Input() testData: any = {};
  @Output() submit = new EventEmitter<any>();
  @ViewChild('fullScreenDiv', { static: true }) fullScreenDiv: ElementRef;
  @ViewChild('video') public video: ElementRef;
  @ViewChild('canvas') public canvas: ElementRef;
  interval$: Subscription;
  videoElement: HTMLVideoElement;
  stream: MediaStream;
  constructor(
    private apiService: ApiService,
    private storeService: StoreService
  ) {}
  isExitPermissible = false;
  ngOnInit() {
    this.sections = this.testData?.sections;
    this.firstQuestion = true;
    this.testForm = new FormGroup({
      sections: new FormArray([]),
    });
    this.sections.forEach((section: any) => {
      let sectionsForm = new FormGroup({ questions: new FormArray([]) });
      section.questions.forEach((que: any) => {
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
              option1: new FormControl(false),
              option2: new FormControl(false),
              option3: new FormControl(false),
              option4: new FormControl(false),
            })
          );
        }
      });
      (this.testForm.get('sections') as FormArray).push(sectionsForm);
    });
    this.interval$ = interval(60000 * 5).subscribe((data) => {
      if (this.testData?.useCamera === true) this.capture();
    });
  }
  ngOnChanges() {}
  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    if (document.hidden) {
      //do whatever you want
      this.submitTest();
    }
  }

  async ngAfterViewInit() {
    this.onFullScreen();
    this.fullScreenDiv.nativeElement.addEventListener(
      'fullscreenchange',
      (e: any) => {
        if (
          document.fullscreenElement == null &&
          this.isExitPermissible === false
        ) {
          this.submitTest();
        }
      }
    );
    if (this.testData?.useCamera === true) await this.setupDevices();
  }
  onFullScreen() {
    const element: any = this.fullScreenDiv.nativeElement;
    this.isExitPermissible = false;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      /* Safari */
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      /* IE11 */
      element.msRequestFullscreen();
    }
  }

  exitFullScreen() {
    console.log('EXITING');

    const element = document.documentElement;
    this.isExitPermissible = true;
    if (document.exitFullscreen) {
      document.exitFullscreen();
      // this.isFullScreen = false;
    }
  }
  async setupDevices() {
    console.log('SETTING UP');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices
          .getUserMedia({
            video: {
              width: 1080,
            },
          })
          .then((stream) => {
            this.videoElement = this.video.nativeElement;
            this.stream = stream;
            this.videoElement.srcObject = this.stream;
            this.videoElement.play();
            // this.video.nativeElement.srcObject = stream;
            // this.video.nativeElement.play();
          });
        // if (stream) {
        //   console.log("CAMERA SUCCESS");

        //   this.video.nativeElement.srcObject = stream;
        //   this.video.nativeElement.play();
        // } else {
        //   console.log("CAMERA FAILED");
        // }
      } catch (e) {
        console.error('FAIlED', e);
      }
    }
  }
  startSection() {
    this.questionIndex++;
    this.firstQuestion = false;
    this.showQuestion =
      this.sections[this.sectionIndex]?.questions[this.questionIndex];
    this.questionType =
      this.sections[this.sectionIndex]?.questions[this.questionIndex]?.queType;
    // const screenshotTarget = this.fullScreenDiv.nativeElement;
    // html2canvas(screenshotTarget).then((canvas) => {
    //     const base64image = canvas.toDataURL("image/png");
    //     console.log(base64image);

    //     window.location.href = base64image;
    // });
  }
  scrollToBottom() {
    setTimeout(() => {
      this.fullScreenDiv.nativeElement.scrollTop =
        this.fullScreenDiv.nativeElement.scrollHeight;
    }, 100);
  }
  sampleTestCasesRun(data: {
    code: string;
    questionNumber: number;
    language: string;
  }) {
    let obj: { code: string; language: string; questionId: string } = {
      code: data.code,
      language: data.language,
      questionId: this.showQuestion._id,
    };
    this.showSampleTestCaseLoader = true;
    this.scrollToBottom();
    this.apiService.runSampleTestCases(obj).subscribe({
      next: (data) => {
        this.showSampleTestCasesResult = true;
        this.sampleTestCaseResult = data.result;
        this.showSampleTestCaseLoader = false;
        this.scrollToBottom();
      },
      error: (err) => {
        if (err?.error?.Output) {
          this.output = err?.error?.Message;
        }
      },
    });
  }
  customrun(data: { code: string; input: string; language: string }) {
    this.apiService.runCustomCode(data).subscribe({
      next: (data) => {
        this.output = data.Output;
      },
      error: (err) => {
        if (err?.error?.Output) {
          this.output = err?.error?.Output;
        }
      },
    });
  }
  public get sectionForm() {
    return (this.testForm.get('sections') as FormArray).at(
      this.sectionIndex
    ) as FormGroup;
  }

  previous() {
    this.showSampleTestCasesResult = false;
    this.codeMode = false;
    if (this.questionIndex > 0) {
      this.questionIndex--;
      this.showQuestion =
        this.sections[this.sectionIndex]?.questions[this.questionIndex];
      this.questionType =
        this.sections[this.sectionIndex]?.questions[
          this.questionIndex
        ]?.queType;
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
        this.lastQuestion = false;
      } else {
        this.questionIndex = -1;
      }
      this.sectionIndex == 0 &&
        this.questionIndex == -1 &&
        (this.firstQuestion = true);
      this.sectionIndex != 0 && (this.firstQuestion = false);
    }
  }
  next() {
    this.showSampleTestCasesResult = false;
    this.codeMode = false;
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
    }
  }
  submitTest() {
    this.submit.emit(this.testForm.value);
    this.exitFullScreen();
  }
  capture() {
    let camSS: any;
    let videoSS: any;
    const videoTarget = this.video.nativeElement;
    const screenshotTarget = this.fullScreenDiv.nativeElement;
    Promise.all([html2canvas(videoTarget), html2canvas(screenshotTarget)]).then(
      (canvas) => {
        camSS = canvas[0].toDataURL('image/png');
        videoSS = canvas[1].toDataURL('image/png');
        this.apiService
          .testProctoring({
            camSS,
            videoSS,
            testId: this.testData._id,
            student: this.storeService.user._id,
          })
          .subscribe({
            next: (data) => {
              console.log('Uploaded SuccessFully');
            },
            error: (err) => {},
          });
      }
    );
    // html2canvas(videoTarget).then((canvas) => {
    // camSS = canvas.toDataURL("image/png");
    // });
    // html2canvas(screenshotTarget).then((canvas) => {
    //   videoSS = canvas.toDataURL("image/png");
    // });
  }
  navigateQuestion(secIndex: any, queIndex: any) {
    this.codeMode = false;
    this.showSampleTestCasesResult = false;
    this.lastQuestion = false;
    this.firstQuestion = false;
    this.sectionIndex = secIndex;
    this.questionIndex = queIndex;
    if (
      this.sectionIndex == this.sections.length - 1 &&
      this.questionIndex == this.sections[this.sectionIndex]?.questions - 1
    ) {
      this.lastQuestion = true;
      this.firstQuestion = false;
    } else if (this.sectionIndex == 0 && this.questionIndex == 0) {
      this.lastQuestion = false;
      this.firstQuestion = true;
    }
    this.showQuestion =
      this.sections[this.sectionIndex]?.questions[this.questionIndex];
    this.questionType =
      this.sections[this.sectionIndex]?.questions[this.questionIndex]?.queType;
  }
  handleToggleCodeMode(): void {
    this.codeMode = !this.codeMode;
  }
  ngOnDestroy() {
    this.interval$.unsubscribe();
  }
  checkHTML(data: string) {
    let regexForHTML = /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/;
    return regexForHTML.test(data);
  }
}
