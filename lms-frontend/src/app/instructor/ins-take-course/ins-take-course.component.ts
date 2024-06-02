import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-ins-take-course',
  templateUrl: './ins-take-course.component.html',
  styleUrls: ['./ins-take-course.component.css']
})
export class InsTakeCourseComponent {
  courseid:string;
  courseModules:any[];
  course:any;
  constructor(private route: ActivatedRoute,private router:Router,private storeService:StoreService){}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.courseid = params['courseid']; 
      this.storeService.getInstructorCourse(this.courseid).subscribe({
        next:(data)=>{
          // console.log("DATA INS COURSE",data);
          
          this.course=data.course;
          this.courseModules = data.course.modules;
          // console.log(data)
        }
      })
    });
  }
  deleteCourse(){
    this.storeService.deleteCourse(this.courseid).subscribe((data:any)=>{
      alert("Course Deleted Successfully");
      this.router.navigate(['instructor']);
    },(error)=>{
      alert("Error while deleting course");
    })
  }
  editCourse(){
    this.router.navigate(['instructor','edit',this.courseid])
  }
}
