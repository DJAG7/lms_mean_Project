import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { StoreService } from 'src/app/services/store.service';
import { Course } from 'src/app/types/course.type';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  constructor(private storeService:StoreService,private route:ActivatedRoute){
  }
  ngOnInit(){
      
  }
}
