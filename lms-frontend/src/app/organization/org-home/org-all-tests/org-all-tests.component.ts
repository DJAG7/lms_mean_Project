import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/api/auth-api.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-org-all-tests',
  templateUrl: './org-all-tests.component.html',
  styleUrls: ['./org-all-tests.component.css']
})
export class OrgAllTestsComponent {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  tests:any=[];
  constructor(private apiService: ApiService,private storeService:StoreService,private router:Router) {}
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
    };
    this.apiService.getOrgTests({organizationId:this.storeService.user._id}).subscribe({
      next: (data:any) => {
        this.tests = data.tests;
        this.dtTrigger.next(this.tests);
      },
      error: (err) => {},
    });
  }
  showAllStudents(testId:string){
    this.router.navigate(['organization','test',testId])
  }
}
