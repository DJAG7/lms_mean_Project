import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-ins-tests',
  templateUrl: './ins-tests.component.html',
  styleUrls: ['./ins-tests.component.css']
})
export class InsTestsComponent {
  tests:any=[]
  constructor(private router:Router,private storeService:StoreService,private apiService:ApiService,private toastr: ToastrService){}
  ngOnInit(){
    this.apiService.getInstructorTest(this.storeService.user._id).subscribe({
      next:(data)=>{
        // console.log(data);
        this.tests=data.tests
      }
    })
  }

  redirectToAddTest(){
    this.router.navigate(['instructor','add-test'])
  }
  deleteTest(testId:string){
    this.apiService.deleteTest(this.storeService.user._id,testId).subscribe({
      next:(res:any)=>{
        this.toastr.success(res?.message)
        this.ngOnInit();
      }
    })
  }
}
