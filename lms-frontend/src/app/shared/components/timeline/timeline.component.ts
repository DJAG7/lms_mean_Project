import { Component, Input, OnInit } from '@angular/core';
import { Module } from 'src/app/types/module.type';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
})
export class TimelineComponent implements OnInit {
  @Input() courseModules: any[];
  @Input() moduleData: any[];
  @Input() courseid: string;
  @Input() enrolledCourseModuleMappings: any;
  ngOnInit() {
  }
}
