import { Component, Input } from '@angular/core';
import { EChartsOption, color } from 'echarts';

@Component({
  selector: 'app-dashgboard-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent {
  pieOptions: EChartsOption;
  lineOptions: EChartsOption;
  @Input() overview: any;
  ngOnInit(): void {}
  ngOnChanges(): void {
    // console.log(this.overview);
    this.pieOptions = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        itemGap: 30,
        textStyle: {
          color: 'white',
        },
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          color: ['#6528F7', '#A2FF86', '#F31559'],
          data: [
            { value: this.overview.coursesTypes.beginner, name: 'Beginner' },
            {
              value: this.overview.coursesTypes.intermediate,
              name: 'intermediate',
            },
            { value: this.overview.coursesTypes.advanced, name: 'advanced' },
          ],
        },
      ],
    };
    this.lineOptions = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Exp'],
        textStyle: {
          color: 'white',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
        borderColor: 'white',
      },
      toolbox: {
        feature: {
          saveAsImage: {},
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: this.overview.percourseExp.courseArray,
        axisLabel: {
          color: 'white',
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: 'white',
        },
      },
      color: ['#6528F7'],
      series: [
        {
          name: 'Exp',
          type: 'line',
          stack: 'Total',
          smooth: true,
          symbolSize: 10,
          lineStyle: {
            width: 4,
          },
          data: this.overview.percourseExp.expArray,
          label: {
            color: '#5567ff',
          },
        },
      ],
    };
  }
}
