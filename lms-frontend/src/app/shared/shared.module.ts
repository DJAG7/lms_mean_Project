import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PathCardComponent } from './components/path-card/path-card.component';
import { CourseCardComponent } from './components/course-card/course-card.component';
import { HeaderComponent } from './components/header/header.component';
import { SubheaderComponent } from './components/subheader/subheader.component';
import { RouterModule } from '@angular/router';
import { QuillComponent } from './quill/quill.component';
import { QuillModule } from 'ngx-quill';
import { TimelineComponent } from './components/timeline/timeline.component';
import { SafePipe } from './pipes/safeurl.pipe';
import { UploadComponent } from './upload/upload.component';
import { floorPipe } from './pipes/floor.pipe';
import { ResultComponent } from './components/result/result.component';
import { ResultPageComponent } from './components/result-page/result-page.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { TestCardComponent } from './components/test-card/test-card.component';
import { QuillEditorWrapperComponent } from './components/quill-editor/quill-editor-wrapper.component';
import { SampleTestsComponent } from './components/sample-tests/sample-tests.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RightSidebarComponent } from './right-sidebar/right-sidebar.component';
import { EditorComponent } from './editor/editor.component';
import { OptionsComponent } from './components/options/options.component';
import { ReportEditorComponent } from './components/report-editor/report-editor.component';

@NgModule({
  declarations: [
    SidebarComponent,
    NavbarComponent,
    PathCardComponent,
    CourseCardComponent,
    HeaderComponent,
    SubheaderComponent,
    QuillComponent,
    TimelineComponent,
    SafePipe,
    UploadComponent,
    floorPipe,
    ResultComponent,
    ResultPageComponent,
    TestCardComponent,
    QuillEditorWrapperComponent,
    SampleTestsComponent,
    RightSidebarComponent,
    EditorComponent,
    OptionsComponent,
    ReportEditorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot(),
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
  ],
  exports: [
    SidebarComponent,
    NavbarComponent,
    PathCardComponent,
    CourseCardComponent,
    HeaderComponent,
    SubheaderComponent,
    TimelineComponent,
    SafePipe,
    UploadComponent,
    floorPipe,
    ResultPageComponent,
    TestCardComponent,
    QuillEditorWrapperComponent,
    SampleTestsComponent,
    EditorComponent,
    RightSidebarComponent,
    OptionsComponent,
    ReportEditorComponent
  ],
})
export class SharedModule {}
