import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quiz-nav',
  templateUrl: './quiz-nav.component.html',
  styleUrls: ['./quiz-nav.component.css'],
})
export class QuizNavComponent {
  @Input() modeType: String;
  @Input() firstQuestion: boolean;
  @Input() lastQuestion: boolean;
  @Output() previous = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() submit = new EventEmitter();
  @Output() emitToggleCodeMode = new EventEmitter();
  @Input() isFullScreenTest = false;
  handleNext() {
    this.next.emit();
  }
  handleSubmit() {
    this.submit.emit();
  }
  handlePrevious() {
    this.previous.emit();
  }
  toggleCodeMode() {
    this.emitToggleCodeMode.emit();
  }
}
