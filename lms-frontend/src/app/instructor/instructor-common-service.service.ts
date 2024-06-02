import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class InstructorCommonServiceService {

  constructor() { };

  public moveItemInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
    const from = this.clamp(fromIndex, formArray.length - 1);
    const to = this.clamp(toIndex, formArray.length - 1);
    console.log(from,to);
    
    if (from === to) {
      return;
    }
  
    // const delta = from > to ? 1 : -1;
    // for (let i = from; i * delta < to * delta; i += delta) {
    //   const previous = formArray.at(i);
    //   const current = formArray.at(i + delta);
    //   formArray.setControl(i, current);
    //   formArray.setControl(i + delta, previous);
    // }
    const previous = formArray.at(from);
    const current = formArray.at(to);
    formArray.setControl(to, previous);
    formArray.setControl(from, current);
  }
  
  /** Clamps a number between zero and a maximum. */
   private clamp(value: number, max: number): number {
    return Math.max(0, Math.min(max, value));
  }
}
