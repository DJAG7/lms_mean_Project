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
  selector: 'app-report-editor',
  templateUrl: './report-editor.component.html',
  styleUrls: ['./report-editor.component.css'],
})
export class ReportEditorComponent {
  @Input() showOnlyCode: boolean = false;
  @Input() code: any = 'asdasd';
  @Input() mode: string = 'Language';
  @Input() outputbox: string = '';
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
    // this.selectedMode = this.mode;
    // if (!this.mode) {
    //   this.mode = 'Language';
    //   this.selectedMode = 'Language';
    // }
    // if (this.mode == 'c_cpp') this.selectedMode = 'cpp';
  }
  ngOnChanges(changes: any) {
    // this.aceEditor.session.setValue(this.code);
    // if (!this.mode) {
    //   this.mode = 'Language';
    //   this.selectedMode = 'Language';
    // }
    // if (this.mode == 'c_cpp') this.selectedMode = 'cpp';
  }
  ngAfterViewInit(): void {
    ace.config.set('fontSize', '14px');
    ace.config.set(
      'basePath',
      'https://unpkg.com/ace-builds@1.4.12/src-noconflict'
    );
    this.aceEditor = ace.edit(this.editor.nativeElement);
    this.aceEditor.session.setValue('Select Language');
    this.aceEditor.session.setValue(this.code);
    this.aceEditor.setOptions({
      enableBasicAutocompletion: true,
    });
    this.aceEditor.setTheme(this.selectedTheme);
    this.aceEditor.session.setMode('ace/mode/' + this.mode);
    this.aceEditor.setReadOnly(true);
  }
}
