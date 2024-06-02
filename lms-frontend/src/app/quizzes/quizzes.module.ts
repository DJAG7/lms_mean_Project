import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizComponent } from './quiz/quiz.component';
import { McqComponent } from './quiz/mcq/mcq.component';
import { CodingComponent } from './quiz/coding/coding.component';
import { quizzesRoutingModule } from './quizzes-routing.module';
import { SharedModule } from '../shared/shared.module';
import { QuizNavComponent } from './quiz/components/quiz-nav/quiz-nav.component';
import { OptionsComponent } from '../shared/components/options/options.component';
import { EditorComponent } from '../shared/editor/editor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimerComponent } from './quiz/components/timer/timer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TestComponent } from './test/test.component';
import { TestFullScrComponent } from './test/test-full-scr/test-full-scr.component';
import { TestReviewComponent } from './test-review/test-review.component';

@NgModule({
  declarations: [
    QuizComponent,
    McqComponent,
    CodingComponent,
    QuizNavComponent,
    TimerComponent,
    TestComponent,
    TestFullScrComponent,
    TestReviewComponent,
  ],
  imports: [
    CommonModule,
    quizzesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  exports: [],
})
export class QuizzesModule {}
