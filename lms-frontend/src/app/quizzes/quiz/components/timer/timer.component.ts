import { Component, Input, Output, EventEmitter } from '@angular/core';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent {
  @Input() showTimer: boolean;
  @Output() submit = new EventEmitter();
  timerSubscription: Subscription;
  @Input() time: any = null;
  secs: number = -1;
  hour: number;
  min: number;
  sec: number;
  ngOnInit() {
    // console.log(this.time);
    this.secs = this.time.minutes * 60;
    if (this.time.hours) this.secs += this.time.hours * 3600;
    this.timerSubscription = interval(1000).subscribe((value: number) => {
      let time = this.secs - value;
      this.hour = Math.floor(time / 3600);
      this.min = Math.floor((time % 3600) / 60);
      this.sec = (time % 3600) % 60;
      if (this.hour <= 0 && this.min <= 0 && this.sec <= 0) {
        this.submit.emit();
        this.timerSubscription.unsubscribe();
      }
    });
  }
  ngOnDestroy():void {
    this.timerSubscription.unsubscribe();
  }
}
