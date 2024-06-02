import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { EChartsOption } from 'echarts';
@Component({
  selector: 'app-result-page',
  templateUrl: './result-page.component.html',
  styleUrls: ['./result-page.component.css'],
})
export class ResultPageComponent {
  @Input() resultData: any;
  @Input() history: any = false;
  @Input() showHeader: any = true;
  @Input() showFooter: any = true;
  @Input() hideReview: any = false;
  @Output() emitNextPage = new EventEmitter();
  @Output() showReview = new EventEmitter();
  horizontalBarOption: EChartsOption;
  verticalBarOption: EChartsOption;
  gaugeOption: EChartsOption;
  ngOnInit(): void {
    this.verticalBarOption = {
      title: {
        text: 'Sectionwise Result',
        top: 0,
        textStyle: {
          color: '#ccc',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // Use axis to trigger tooltip
          type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
        },
      },
      color: ['green', 'red'],
      xAxis: {
        type: 'category',
        data: this.resultData.sectionwiseScore?.categories,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: this.resultData.sectionwiseScore?.correctScore,
          name: 'Correct',
          type: 'bar',
        },
        {
          data: this.resultData.sectionwiseScore?.incorrectScore,
          name: 'Incorrect',
          type: 'bar',
        },
      ],
    };
    this.horizontalBarOption = {
      title: {
        text: 'Result',
        top: 0,
        textStyle: {
          color: '#ccc',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // Use axis to trigger tooltip
          type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
        },
      },
      color: ['#ff0000', '#91cc75'],
      xAxis: {
        type: 'value',
      },
      yAxis: {
        type: 'category',
        data: ['Correct', 'Wrong'],
      },
      series: [
        {
          data: [
            {
              value: this.resultData.totalCorrect,
              itemStyle: { color: 'green' },
            },
            {
              value:
                this.resultData.totalQuestions - this.resultData.totalCorrect,
              itemStyle: { color: 'red' },
            },
          ],
          name: 'X',
          type: 'bar',
        },
      ],
    };
    if (!this.history) {
      this.gaugeOption = {
        title: {
          text: 'Exp Points Earned',
          left: 'center',
          top: 0,
          textStyle: {
            color: '#ccc',
          },
        },
        tooltip: {
          formatter: '{b} : {c}%',
        },
        series: [
          {
            type: 'gauge',
            min: 0,
            max: this.resultData.pointsEarned.maxPoints,
            axisLine: {
              lineStyle: {
                width: 30,
                color: [
                  [0.3, '#67e0e3'],
                  [0.7, '#37a2da'],
                  [1, '#fd666d'],
                ],
              },
            },
            pointer: {
              itemStyle: {
                color: 'auto',
              },
            },
            axisTick: {
              distance: -30,
              length: 8,
              lineStyle: {
                color: '#fff',
                width: 2,
              },
            },
            splitLine: {
              distance: -30,
              length: 30,
              lineStyle: {
                color: '#fff',
                width: 4,
              },
            },
            axisLabel: {
              color: 'inherit',
              distance: 40,
              fontSize: '10px',
            },
            detail: {
              valueAnimation: true,
              formatter: '{value} Pts',
              color: 'inherit',
              fontSize: '10px',
            },
            data: [
              {
                value: this.resultData.pointsEarned.points,
              },
            ],
          },
        ],
      };
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['resultData']) {
      this.verticalBarOption = {
        title: {
          text: 'Sectionwise Result',
          top: 0,
          textStyle: {
            color: '#ccc',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        color: ['green', 'red'],
        xAxis: {
          type: 'category',
          data: this.resultData.sectionwiseScore?.categories,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: this.resultData.sectionwiseScore?.correctScore,
            name: 'Correct',
            type: 'bar',
          },
          {
            data: this.resultData.sectionwiseScore?.incorrectScore,
            name: 'Incorrect',
            type: 'bar',
          },
        ],
      };
      this.horizontalBarOption = {
        title: {
          text: 'Result',
          top: 0,
          textStyle: {
            color: '#ccc',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        color: ['#ff0000', '#91cc75'],
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
          data: ['Correct', 'Wrong'],
        },
        series: [
          {
            data: [
              {
                value: this.resultData.totalCorrect,
                itemStyle: { color: 'green' },
              },
              {
                value:
                  this.resultData.totalQuestions - this.resultData.totalCorrect,
                itemStyle: { color: 'red' },
              },
            ],
            name: 'X',
            type: 'bar',
          },
        ],
      };
      if (!this.history) {
        this.gaugeOption = {
          title: {
            text: 'Exp Points Earned',
            left: 'center',
            top: 0,
            textStyle: {
              color: '#ccc',
            },
          },
          tooltip: {
            formatter: '{b} : {c}%',
          },
          series: [
            {
              type: 'gauge',
              min: 0,
              max: this.resultData.pointsEarned.maxPoints,
              axisLine: {
                lineStyle: {
                  width: 30,
                  color: [
                    [0.3, '#67e0e3'],
                    [0.7, '#37a2da'],
                    [1, '#fd666d'],
                  ],
                },
              },
              pointer: {
                itemStyle: {
                  color: 'auto',
                },
              },
              axisTick: {
                distance: -30,
                length: 8,
                lineStyle: {
                  color: '#fff',
                  width: 2,
                },
              },
              splitLine: {
                distance: -30,
                length: 30,
                lineStyle: {
                  color: '#fff',
                  width: 4,
                },
              },
              axisLabel: {
                color: 'inherit',
                distance: 40,
                fontSize: '10px',
              },
              detail: {
                valueAnimation: true,
                formatter: '{value} Pts',
                color: 'inherit',
                fontSize: '10px',
              },
              data: [
                {
                  value: this.resultData.pointsEarned.points,
                },
              ],
            },
          ],
        };
      }
    }
  }
  nextPage() {
    this.emitNextPage.emit();
  }
  goToReviewPage() {
    this.showReview.emit();
  }
}
