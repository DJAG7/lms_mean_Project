import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mcq',
  templateUrl: './mcq.component.html',
  styleUrls: ['./mcq.component.css'],
})
export class McqComponent {
  showQuestion: number = 0;
  lastQuestion:boolean = false;
  firstQuestion:boolean = true;
  showTimer:boolean = false;
  questions: any = [
    {
      name: 'Problem1',
      description:
        'lorem ipsum dolor sit amet lobortis in jeifht kslel sfjjrkwn kriflot kdsirnt?',
      options: [
        'loremsj sdfsdf sdfsdfsdfwef fsdfsdf',
        'loremsj sdfsdf sdfsdfsdfwef fsdfsdf',
        'loremsj sdfsdf sdfsdfsdfwef fsdfsdf',
        'loremsj sdfsdf sdfsdfsdfwef fsdfsdf',
      ],
    },
    {
      name: 'Problem2',
      description:
        'lorem ipsum dolor sit amet lobortis in jeifht kslel sfjjrkwn kriflot kdsirnt?',
      options: [
        'asdj loremsj sdfsdf sdfsdfsdfwef fsdfsdf',
        'bfjr loremsj sdfsdf sdfsdfsdfwef fsdfsdf',
        'jnfr loremsj sdfsdf sdfsdfsdfwef fsdfsdf',
        'nlknfl loremsj sdfsdf sdfsdfsdfwef fsdfsdf',
      ],
    },
  ];
  answers: any = [];
  mcqForm: FormGroup;
  constructor() {
    this.mcqForm = new FormGroup({
      options: new FormArray([]),
    });
  }
  ngOnInit(): void {
    (<FormArray>this.mcqForm.get('options')).controls.push(
      new FormGroup({
        option1: new FormControl(),
        option2: new FormControl(),
        option3: new FormControl(),
        option4: new FormControl(),
      })
    );
  }
  next() {
    this.showQuestion += 1;
    if(this.showQuestion>=(<FormArray>this.mcqForm.get('options')).controls.length){
    (<FormArray>this.mcqForm.get('options')).controls.push(
      new FormGroup({
        option1: new FormControl(),
        option2: new FormControl(),
        option3: new FormControl(),
        option4: new FormControl(),
      })
    );
    }
    this.firstQuestion = false;
    if(this.showQuestion == this.questions.length-1){
      this.lastQuestion = true;
    }
  }
  previous() {
    this.showQuestion -= 1;
    this.lastQuestion = false;
    if(this.showQuestion == 0){
      this.firstQuestion = true;
    }
  }
  submit(){
    this.answers = [];
    for(let control of (<FormArray>this.mcqForm.get('options')).controls)
    {
      this.answers.push(control.value);
    }
    // console.log(this.answers);
  }
}
