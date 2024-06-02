import { Component,EventEmitter,Input,Output } from '@angular/core';

@Component({
  selector: 'app-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.css']
})
export class SubheaderComponent {
  @Input() typeOfHeader:string;
  @Input() nameOfCourse:string;
  @Input() instructorName:string;
  @Input() lessonCompleted:boolean;
  @Input() course:any;
  @Output() markCompleted = new EventEmitter();
  @Output() nextLesson = new EventEmitter();
  @Output() previousLesson = new EventEmitter();

  completed(){
    this.markCompleted.emit();
  }
  next(){
    this.nextLesson.emit();
  }
  previous(){
    this.previousLesson.emit();
  }
}
