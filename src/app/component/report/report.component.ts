import { Component, OnInit } from '@angular/core';
import * as CanvasJS from '../../../assets/js/canvasjs.min';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.basicChart();
    this.pieChart();

  }

  basicChart() {
    let chart = new CanvasJS.Chart('chartContainer', {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Basic Column Chart in Angular'
      },
      data: [{
        type: 'column',
        dataPoints: [
          { y: 71, label: 'Apple' },
          { y: 55, label: 'Mango' },
          { y: 50, label: 'Orange' },
          { y: 65, label: 'Banana' },
          { y: 95, label: 'Pineapple' },
          { y: 68, label: 'Pears' },
          { y: 28, label: 'Grapes' },
          { y: 34, label: 'Lychee' },
          { y: 14, label: 'Jackfruit' }
        ]
      }]
    });

    chart.render();
  }

  pieChart() {
    let chart = new CanvasJS.Chart('pieContainer', {
      theme: 'light2',
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: 'Shares of Electricity Generation by Fuel'
      },
      subtitles: [{
        text: 'United Kingdom, 2016',
        fontSize: 16
      }],
      data: [{
        type: 'pie',
        indexLabelFontSize: 18,
        radius: 80,
        indexLabel: '{label} - {y}',
        yValueFormatString: '###0.0\'%\'',
        click: this.explodePie,
        dataPoints: [
          { y: 42, label: 'Gas' },
          { y: 21, label: 'Nuclear' },
          { y: 24.5, label: 'Renewable' },
          { y: 9, label: 'Coal' },
          { y: 3.1, label: 'Other Fuels' }
        ]
      }]
    });

    chart.render();
  }

  explodePie(e) {
    for (let i = 0; i < e.dataSeries.dataPoints.length; i++) {
      if (i !== e.dataPointIndex) {
        e.dataSeries.dataPoints[i].exploded = false;
      }
    }

  }


}
