import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent {
  @Input() options: any[] = ['Option1', 'Option2', 'Option3', 'Option4'];
  @Input() quizForm: any;
  @Input() questionNumber: any;
  @Input() type: string;
  ngOnInit(): void {
    console.log(this.quizForm);
  }
  getOptionsFormGroup(index: any) {
    return this.quizForm.get('questions').controls[index];
  }
}
