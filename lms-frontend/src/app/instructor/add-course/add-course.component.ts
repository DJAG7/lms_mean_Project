import { Component ,ViewChild,OnInit} from '@angular/core';
import { FormControl, FormGroup ,Validators } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { ContentChange, QuillEditorComponent } from 'ngx-quill'
import { Subscription } from 'rxjs';
import { StoreService } from 'src/app/services/store.service';
import { Course, CourseData } from 'src/app/types/course.type';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent implements OnInit {
  courseForm:FormGroup;
  priceForm:FormGroup;
  hide=false;
  editorStyle = {
    minHeight: '100px',
    backgroundColor:'#ffffff',
  };
  formData:CourseData
  @ViewChild('editor') editor: QuillEditorComponent
  routerEvents:Subscription;
  constructor(private storeService:StoreService,private router:Router){
    this.courseForm=new FormGroup({
      name:new FormControl("",[Validators.required]),
      description: new FormControl("",[Validators.required]),
      thumbnail:new FormControl("",[Validators.required]),
      trailer:new FormControl("",[Validators.required]),
      difficulty:new FormControl('beginner')
    })
    this.priceForm=new FormGroup({
      price:new FormControl(0,[Validators.required]),
      tags:new FormControl([]),
    })
    this.routerEvents=router.events.subscribe((val) => {
      if(val instanceof NavigationStart){
        if(!val.url.includes('add-module')){
          this.storeService.resetCourse();
        }
      }
  });
  }

  ngOnInit(): void {
    let formData=this.storeService.courseData;
    // console.log(formData);
    
    this.formData=formData;
    this.courseForm.patchValue({
      name:formData.name,
      description:formData.description,
      thumbnail:formData.thumbnail,
      trailer:formData.trailer,
      price:formData.price,
      difficulty:formData.difficulty,
    })
    this.priceForm.setValue({
      price:formData.price,
      tags:formData.tags
    })
  }

  isFormValid(){
    return this.courseForm.valid&&this.priceForm.valid;
  }

  addModule(){
    let data={...this.courseForm.value,...this.priceForm.value}
    this.storeService.setPrimaryCourseData(data)
    this.router.navigate(['instructor','add-module'])
  }
  addCourse(){
    // console.log(this.courseForm.value);
    let priceValue={...this.priceForm.value}
    let data={...this.courseForm.value,...priceValue}
    data.price=parseInt(data.price);
    this.storeService.setPrimaryCourseData(data);
    // console.log(this.storeService.courseData);
    this.storeService.addCourse().subscribe({
      next:(data)=>{
        // console.log(data);
        // alert("Course Added SuccessFully");
        this.router.navigate(['instructor']);
      },
      error:(err)=>{
        alert("Something Went Wrong!Please Try Again")
      }
    })
  }

  saveAsDraft(){
    // console.log("SAVING as draft");
    
    let priceValue={...this.priceForm.value}
    let data={...this.courseForm.value,...priceValue}
    data.price=parseInt(data.price);
    this.storeService.setPrimaryCourseData(data);
    this.storeService.addDraftCourse().subscribe({
      next:(data)=>{
        console.log(data);
        // alert("Course Added SuccessFully");
        this.router.navigate(['instructor']);
      },
      error:(err)=>{
        alert("Something Went Wrong!Please Try Again")
      }
    })
  }
  getFormControl(control:any){
    return control as FormControl
  }
  resetCourse(){
    this.storeService.resetCourse();
    this.courseForm.reset()
    this.priceForm.reset();
    this.formData.modules=[]
  }

  ngOnDestroy(){
    this.routerEvents.unsubscribe()
  }
}
