import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ins-course-card',
  templateUrl: './ins-course-card.component.html',
  styleUrls: ['./ins-course-card.component.css']
})
export class InsCourseCardComponent {
  @Input() course: any;
  @Input() name: string="";
}
