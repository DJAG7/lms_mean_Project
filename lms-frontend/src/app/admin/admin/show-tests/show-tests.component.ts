import { Component } from '@angular/core';
import csvDownload from 'json-to-csv-export';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Course } from 'src/app/types/course.type';
@Component({
  selector: 'app-show-tests',
  templateUrl: './show-tests.component.html',
  styleUrls: ['./show-tests.component.css']
})
export class ShowTestsComponent {
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
    this.apiService.getAllTests().subscribe({
      next: (data) => {
        this.courses = data.tests;
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
    this.apiService.enrollTest(this.enrollEmail,this.activeCourseId).subscribe({
      next:data=>{alert('Successfully added Student')},
      error:err=>{console.log(err);alert(err.error.message)}
    })
  }
  bulkEnroll(){
    // console.log(this.activeCourseId,this.enrollFile);
    this.apiService.bulkEnrollTest(this.enrollFile,this.activeCourseId).subscribe({
      next:data=>{
          // console.log("DATA",data);
          const dataToConvert = {
            data: data.FinalObj,
            filename: 'BulkUploadTestSheet',
            delimiter: ',',
            headers: ['email', "status", "reason"]
          }
          csvDownload(dataToConvert)
      },
      error:err=>{
        const dataToConvert = {
          data: err.FinalObj,
          filename: 'BulkUploadTestSheet-Error',
          delimiter: ',',
          headers: ['email', "status", "reason"]
        }
        csvDownload(dataToConvert)
      }
    })
  }
  onFileChange(event:any){
    this.enrollFile= event.target.files[0];
    // console.log(event);
  }
}
