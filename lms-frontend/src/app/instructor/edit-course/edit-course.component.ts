import { Component, ViewChild, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { Subscription } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';
import { CourseData } from 'src/app/types/course.type';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css'],
})
export class EditCourseComponent {
  courseForm: FormGroup;
  priceForm: FormGroup;
  hide = false;
  editorStyle = {
    minHeight: '100px',
    backgroundColor: '#ffffff',
  };
  courseId: any = '';
  courseModules: any = [];
  course: any = {};
  formData: CourseData;
  @ViewChild('editor') editor: QuillEditorComponent;
  routerEvents:Subscription
  constructor(
    private storeService: StoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.courseForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      thumbnail: new FormControl('', [Validators.required]),
      trailer: new FormControl('', [Validators.required]),
      difficulty: new FormControl('beginner'),
    });
    this.priceForm = new FormGroup({
      price: new FormControl(0, [Validators.required]),
      tags: new FormControl([]),
    });

    this.routerEvents=router.events.subscribe((val) => {
      if(val instanceof NavigationStart){
        if(!val.url.includes('edit')){
          this.storeService.resetCourse();
        }
      }
  });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data: any) => {
      // console.log(data);
      this.courseId = data.courseid;
      if (this.storeService?.courseData?._id == this.courseId) {
        let formData = this.storeService.courseData;
        this.courseModules = formData.modules;
        // console.log("FORM DATA",this.storeService.courseData);
        this.initForm(formData);
      } else {
        this.storeService.getInstructorCourse(this.courseId).subscribe({
          next: (data) => {
            // console.log('DATA INS COURSE', data);
            this.course = data.course;
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
            // console.log(formData);
            // console.log("COUTSE DATA ",this.storeService.courseData);

            this.formData = formData;
            this.initForm(formData);
            let dataforStore = {
              ...this.courseForm.value,
              ...this.priceForm.value,
              _id: this.courseId,
            };
            this.storeService.setPrimaryCourseData(dataforStore);
            this.courseModules.forEach((ele: any) => {
              this.storeService.addModule(ele);
            });
            this.courseModules = this.storeService.courseData?.modules;
          },
        });
      }
    });
  }

  initForm(formData: any) {
    // console.log(formData);
    this.courseForm.patchValue({
      name: formData.name,
      description: formData.description,
      thumbnail: formData.thumbnail,
      trailer: formData.trailer,
      price: formData.price,
      difficulty: formData.difficulty,
    });
    this.priceForm.setValue({
      price: formData.price,
      tags: formData.tags.map((item: any) => {
        if(Array.isArray(item))
          return item[0];
        else return item;
      }),
    });
  }
  isFormValid() {
    return this.courseForm.valid && this.priceForm.valid;
  }

  addModule() {
    let data = {
      ...this.courseForm.value,
      ...this.priceForm.value,
      _id: this.courseId,
    };
    this.storeService.setPrimaryCourseData(data);
    this.router.navigate(['instructor', 'edit', this.courseId, 'add']);
  }
  editCourse() {
    let priceValue = { ...this.priceForm.value };
    let data = { ...this.courseForm.value, ...priceValue, _id: this.courseId };
    data.price = parseInt(data.price);
    this.storeService.setPrimaryCourseData(data);
    this.storeService.editCourse().subscribe({
      next: (data) => {
        // console.log(data);
        // alert("Course Added SuccessFully");
        this.router.navigate(['instructor']);
      },
      error: (err) => {
        alert('Something Went Wrong!Please Try Again');
      },
    });
  }

  getFormControl(control: any) {
    return control as FormControl;
  }
  resetCourse() {
    this.storeService.resetCourse();
    this.courseForm.reset();
    this.priceForm.reset();
    this.formData.modules = [];
  }

  goToEditPage(index: number) {
    let data = {
      ...this.courseForm.value,
      ...this.priceForm.value,
      _id: this.courseId,
    };
    this.storeService.setPrimaryCourseData(data);
    this.router.navigate([index], { relativeTo: this.activatedRoute });
  }
  ngOnDestroy(){
    this.routerEvents.unsubscribe();
  }
}
