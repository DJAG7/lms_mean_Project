import { Component } from '@angular/core';
import csvDownload from 'json-to-csv-export';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Course } from 'src/app/types/course.type';
@Component({
  selector: 'app-show-courses',
  templateUrl: './show-courses.component.html',
  styleUrls: ['./show-courses.component.css'],
})
export class ShowCoursesComponent {
  enrollEmail: string;
  enrollFile:any=null;
  activeCourseId:string;
  courses: Course[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  constructor(private apiService: ApiService) {}
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
    };
    this.apiService.getCourses().subscribe({
      next: (data) => {
        this.courses = data.courses;
        // console.log(this.courses);
        this.dtTrigger.next(this.courses);
      },
      error: (err) => {},
    });
  
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


  enrollBtnClick(id:string){
    this.activeCourseId=id;
  }
  addStudent(){
    // console.log(this.activeCourseId,this.enrollEmail);
    this.apiService.enrollCourse(this.enrollEmail,this.activeCourseId).subscribe({
      next:data=>{alert('Successfully added Student')},
      error:err=>{console.log(err);alert(err.error.message)}
    })
  }
  bulkEnroll(){
    // console.log(this.activeCourseId,this.enrollFile);
    this.apiService.bulkEnroll(this.enrollFile,this.activeCourseId).subscribe({
      next:data=>{
          // console.log("DATA",data);
          const dataToConvert = {
            data: data.FinalObj,
            filename: 'BulkUploadSheet',
            delimiter: ',',
            headers: ['email', "status", "reason"]
          }
          csvDownload(dataToConvert)
      },
      error:err=>{alert('Error')}
    })
  }
  onFileChange(event:any){
    this.enrollFile= event.target.files[0];
    // console.log(event);
  }
}
