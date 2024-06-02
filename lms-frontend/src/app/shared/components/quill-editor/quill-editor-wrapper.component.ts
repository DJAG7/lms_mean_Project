import { Component, Input, ViewChild, forwardRef } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/types/course.type';
import { ContentChange, QuillEditorComponent } from 'ngx-quill';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import Quill from 'quill';
@Component({
  selector: 'app-quill-editor-wrapper',
  templateUrl: './quill-editor-wrapper.component.html',
  styleUrls: ['./quill-editor-wrapper.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QuillEditorWrapperComponent),
      multi: true,
    },
  ],
})
export class QuillEditorWrapperComponent {
  private quillEditor: Quill;
  private onChangeCallback: (value: string) => void;
  private onTouchedCallback: () => void;
  editorStyle = {
    minHeight: '100px',
    backgroundColor: '#ffffff',
    width: '100%',
  };
  ngOnInit(): void {
    this.quillEditor = new Quill('#quill-editor', {
      theme: 'snow',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],

          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],

          [{ size: ['small', false, 'large', 'huge'] }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
        ],
      },
    });

    this.quillEditor.on('text-change', () => {
      this.onChangeCallback(this.quillEditor.root.innerHTML);
      this.onTouchedCallback();
    });
  }
  writeValue(value: string): void {
    this.quillEditor.root.innerHTML = value || '';
  }

  registerOnChange(callback: (value: string) => void): void {
    this.onChangeCallback = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouchedCallback = callback;
  }

  setDisabledState(isDisabled: boolean): void {
    this.quillEditor.enable(!isDisabled);
  }
}
