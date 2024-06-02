import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-course-timeline',
  templateUrl: './course-timeline.component.html',
  styleUrls: ['./course-timeline.component.css']
})
export class CourseTimelineComponent {
  @Input() moduleData: any[];
  @Output() moduleDataChange=new EventEmitter<any>();
  @Input() isEditable:boolean=false;
  @Output() editClick=new EventEmitter<any>();
  ngOnInit(){
    for(let module of this.moduleData){
      // console.log("MODULE",module);
      
      if(module.content){
        module.lessons=module.content;
      }
    }
  }
  editModule(i:number){
    this.editClick.emit(i);
  }
  updateValue(){
    this.moduleDataChange.emit(this.moduleData);
  }
  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.moduleData, event.previousIndex, event.currentIndex);
    this.updateValue();
  }
}
