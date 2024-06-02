import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as ace from 'ace-builds';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
})
export class EditorComponent {
  @Input() mode: string = 'Language';
  @Input() outputbox: string = '';
  @Input() quizForm: any = null;
  @Input() questionNumber: number;
  @Input() showRunSampleTestCases: boolean = false;
  @Output() customRun: EventEmitter<{
    code: string;
    input: string;
    language: string;
  }> = new EventEmitter();
  @Output() sampleTestCasesRun: EventEmitter<{
    code: string;
    questionNumber: number;
    language: string;
  }> = new EventEmitter();
  showInput: boolean = true;
  showOutput: boolean = true;
  showCode: boolean = true;
  selectedTheme: string = 'ace/theme/twilight';
  selectedFontSize = '14px';
  editorRowTwoClass: string = 'col-4';
  editorRowThreeClass: string = 'col-4';
  selectedMode: string = 'Language';
  editorVal: string = '';
  inputbox: string;
  aceEditor: any = null;
  defaultCode: { [key: string]: string } = {
    Language: 'Select Language',
    c: '#include<stdio.h>\n\nint main() {\n    // Write your code here\n    return 0;\n}',
    cpp: '#include<iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}',
    java: 'import java.util.*;\nimport java.io.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}',
    python: "# Write your code here \nprint('Hello world')",
    cs: 'using System;\n\npublic class Main {\n    public static void Main() {\n        // Write your code here\n    }\n}',
  };
  handleRun: Subject<any> = new Subject();
  handleSampleTestCases: Subject<any> = new Subject();
  @ViewChild('editor') private editor: ElementRef<HTMLElement>;
  constructor(private toastr: ToastrService, private ref: ChangeDetectorRef) {}
  ngOnInit() {
    if (this.quizForm) {
      this.mode = this.quizForm
        .get('questions')
        .controls[this.questionNumber].get('language').value;
    }
    this.selectedMode = this.mode;
    if (!this.mode) {
      this.mode = 'Language';
      this.selectedMode = 'Language';
    }
    if (this.mode == 'c_cpp') this.selectedMode = 'cpp';
    this.handleRun.pipe(debounceTime(1000)).subscribe({
      next: (data: any) => {
        this.customRun.emit(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.handleSampleTestCases.pipe(debounceTime(1000)).subscribe({
      next: (data: any) => {
        this.sampleTestCasesRun.emit(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  ngOnChanges(changes: any) {
    if (this.quizForm && changes.questionNumber && this.aceEditor) {
      this.aceEditor.session.setValue(
        this.quizForm.get('questions').controls[this.questionNumber].get('code')
          .value
      );
      this.mode = this.quizForm
        .get('questions')
        .controls[this.questionNumber].get('language').value;
      this.selectedMode = this.mode;
      if (!this.mode) {
        this.mode = 'Language';
        this.selectedMode = 'Language';
      }
      if (this.mode == 'c_cpp') this.selectedMode = 'cpp';
    }
  }
  ngAfterViewInit(): void {
    ace.config.set('fontSize', '14px');
    ace.config.set(
      'basePath',
      'https://unpkg.com/ace-builds@1.4.12/src-noconflict'
    );
    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.session.setValue('Select Language');
    if (this.quizForm) {
      this.aceEditor.session.setValue(
        this.quizForm.get('questions').controls[this.questionNumber].get('code')
          .value
      );
    }
    this.aceEditor.setOptions({
      enableBasicAutocompletion: true,
    });
    this.aceEditor.setTheme(this.selectedTheme);
    this.aceEditor.session.setMode('ace/mode/' + this.mode);
    this.aceEditor.on('change', () => {
      this.editorVal = this.aceEditor.getValue();
      if (this.quizForm) {
        this.quizForm
          .get('questions')
          .controls[this.questionNumber].get('code')
          .patchValue(this.editorVal);
      }
    });
  }
  selectMode(data: any) {
    this.mode = data.target.value;
    const aceEditor = ace.edit(this.editor.nativeElement);
    aceEditor.session.setValue(this.defaultCode[this.mode]);
    if (this.mode == 'cpp' || this.mode == 'c') this.mode = 'c_cpp';
    aceEditor.session.setMode('ace/mode/' + this.mode);
    if (this.quizForm) {
      this.quizForm
        .get('questions')
        .controls[this.questionNumber].get('language')
        .patchValue(this.mode);
    }
  }
  selectTheme(data: any) {
    this.selectedTheme = data.target.value;
    this.aceEditor.setTheme(this.selectedTheme);
  }
  selectFontSize(data: any) {
    this.selectedFontSize = data.target.value;
    console.log(this.selectedFontSize);
    this.aceEditor.setOptions({
      fontSize: this.selectedFontSize,
    });
  }
  run() {
    this.handleRun.next({
      code: this.editorVal,
      input: this.inputbox,
      language: this.mode,
    });
  }
  runSampleTestCases() {
    this.handleSampleTestCases.next({
      code: this.editorVal,
      language: this.mode,
      questionNumber: this.questionNumber,
    });
  }
  getQuestionsFormGroup(index: any) {
    // console.log( this.quizForm.get('questions').controls[index]);
    return this.quizForm.get('questions').controls[index];
  }
  handleEditorExpand(type: 'input' | 'output' | 'code') {
    if (type == 'code') {
      this.showCode = !this.showCode;
    }
    if (type == 'input') {
      this.showInput = !this.showInput;
    }
    if (type == 'output') {
      this.showOutput = !this.showOutput;
    }
    let activeCol = 0;
    activeCol =
      (this.showCode ? 1 : 0) +
      (this.showInput ? 1 : 0) +
      (this.showOutput ? 1 : 0);
    if (activeCol == 0) {
      this.showCode = true;
      activeCol = 1;
    }
    console.log(activeCol);
    this.editorRowTwoClass =
      activeCol == 3 ? 'col-4' : activeCol == 2 ? 'col-5' : 'col-8';
    this.editorRowThreeClass =
      activeCol == 3 ? 'col-4' : activeCol == 2 ? 'col-6' : 'col-12';
  }
}
