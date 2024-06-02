import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './quiz/quiz.component';
import { McqComponent } from './quiz/mcq/mcq.component';
import { CodingComponent } from './quiz/coding/coding.component';
import { TestComponent } from './test/test.component';
import { TestReviewComponent } from './test-review/test-review.component';


const routes: Routes = [
  {path:'quiz/:quiztype/:courseid/:moduleid/:quizid',component:QuizComponent},
  {path:'test/review/:testId',component:TestReviewComponent},
  {path:'test/:testId',component:TestComponent}
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class quizzesRoutingModule {}
