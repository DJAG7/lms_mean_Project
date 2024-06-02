import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sample-tests',
  templateUrl: './sample-tests.component.html',
  styleUrls: ['./sample-tests.component.css'],
})
export class SampleTestsComponent {
  @Input() SampleTestsResults: any = [];
  @Output() scrollToBottom = new EventEmitter();
  showTestDetails: boolean = false;
  testInput: any = '';
  expectedOutput: string;
  actualOutput: string;
  ngOnChanges(data: any) {
    if (data.SampleTestsResults) {
      this.showTestDetails = false;
    }
  }
  showDetails(data: any) {
    this.showTestDetails = true;
    this.testInput = data.input;
    this.actualOutput = data.actualOutput;
    this.expectedOutput = data.expectedOutput;
    this.scrollToBottom.emit('true');
  }
}
