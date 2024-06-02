import { Component,OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';
import { Course } from 'src/app/types/course.type';
import {Subscription} from  'rxjs';
import { User } from 'src/app/types/user.type';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user:User;
  courses:any[];
  overview:any;
  userSubscription: Subscription;
  constructor( private storeService:StoreService,private apiService: ApiService){}
  ngOnInit() {
    this.userSubscription = this.storeService.loggedInUser$.subscribe({
      next:(data)=>{this.user=data},
      error:()=>{}
    });
    this.apiService.getStudentOverview(this.user._id).subscribe({
      next:(data)=>{this.overview = data},
      error:(error)=>{}
    })
    this.apiService.getStudentCourses(this.user._id).subscribe({
      next:(data)=>{this.courses = data.courses;
      // console.log(this.courses)
    },
      error:(err)=>{}
    })
  }
}
