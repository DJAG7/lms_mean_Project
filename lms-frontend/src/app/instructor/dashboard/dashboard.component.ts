import { Component,OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';
import { Course } from 'src/app/types/course.type';
import {Subscription} from  'rxjs';
import { User } from 'src/app/types/user.type';
import { InstructorApiService } from 'src/app/services/api/instructor-api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-instructor-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class InstructorDashboardComponent implements OnInit {
  user:User;
  courses:Course[];
  userSubscription: Subscription;
  constructor( private storeService:StoreService,private instructorApiService:InstructorApiService,private router:Router,private activatedRoute:ActivatedRoute){}
  ngOnInit() {
    this.userSubscription = this.storeService.loggedInUser$.subscribe({
      next:(data)=>{
        this.user=data;
        // console.log(this.user)
      },
      error:()=>{}
    });
    this.instructorApiService.getCourses(this.user.email).subscribe({
      next:(data)=>{
      this.courses = data.courses;
      // console.log(this.courses)
    },
      error:(err)=>{}
    })
  }
  redirectToAddCourse(){
    this.router.navigate(['add-course'],{relativeTo:this.activatedRoute})
  }
}
