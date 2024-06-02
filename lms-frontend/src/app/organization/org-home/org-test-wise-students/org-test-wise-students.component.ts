import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import csvDownload from 'json-to-csv-export';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/api/auth-api.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-org-test-wise-students',
  templateUrl: './org-test-wise-students.component.html',
  styleUrls: ['./org-test-wise-students.component.css'],
})
export class OrgTestwiseStudentsComponent {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  students: any = [];
  testSummary:any=[];
  testDataLoaded:any=false;
  constructor(
    private apiService: ApiService,
    private storeService: StoreService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
    };
    let testId = this.activatedRoute.snapshot.params?.['testId'];
    this.apiService
        .getTestSummaryById(
          this.storeService.role,
          testId,
          this.storeService.user._id
        )
        .subscribe({
          next: (testData) => {
            this.testDataLoaded=true;
            this.testSummary = testData.tests?.[0];
          },
          error: (err) => {
            console.log(err);
            
            // this.router.navigate(['']);
          },
        });
    this.apiService
      .getOrgTestWiseStudents({
        organizationId: this.storeService.user._id,
        testId,
      })
      .subscribe({
        next: (data: any) => {
          this.students = data.students.map((item: any) => {
            if (item.status != 'completed') {
              item.score = {
                correct: 0,
                wrong: 0,
                totalQuestion: 'Not Attempted Yet',
              };
              item.sectionwiseScore=[];
            } else {
              item.score = {
                ...item.score,
                totalQuestion: item.score.correct + item.score.wrong,
              };
            }
            return item;
          });
          this.dtTrigger.next(this.students);
        },
        error: (err) => {},
      });
  }
  navigateResult(student: any) {
    console.log(student);
    this.router.navigate(['reports', 'student', student._id]);
  }
  downloadScores(){
    let headers=['Name',"Email","Status","Total Questions","Total Correct","Total Wrong"];
    this.testSummary.sections.forEach((section:any,index:number)=>{
      headers.push('Section '+(index+1)+' Correct');
      headers.push('Section '+(index+1)+' Wrong');
    })
    let downloadData=this.students.map((item: any) => {
      let sectionData:any={};
      if(item.status!='completed'){
        this.testSummary.sections.forEach((section:any,index:number)=>{
          sectionData['Section '+(index+1)+' Correct']=0;
          sectionData['Section '+(index+1)+' Wrong']=0;
        })
      }
      item.sectionwiseScore.forEach((section:any,index:number)=>{
        sectionData['Section '+(index+1)+' Correct']=(section.correct);
        sectionData['Section '+(index+1)+' Wrong']=(section.incorrect);
      });
      return {
      Name:item.student.name,
      Email:item.student.email,
      Status:item.status,
      "Total Questions":item.score.totalQuestion,
      "Total Correct":(item.score.correct),
      "Total Wrong":(item.score.wrong),
      ...sectionData
    }})
    const dataToConvert = {
      data: downloadData,
      filename: 'TestData',
      delimiter: ',',
      headers: headers
    }
    csvDownload(dataToConvert)
  }
}
