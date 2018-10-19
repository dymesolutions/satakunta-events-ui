import { Component, OnInit } from '@angular/core';
import { ReportService } from '@app/services/report.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-place-usage-count',
  templateUrl: './place-usage-count.component.html',
  styleUrls: ['./place-usage-count.component.scss']
})
export class PlaceUsageCountComponent implements OnInit {

  chartOptions: any;

  chartLabels: string[];
  chartType: string;
  chartLegend: boolean;

  chartData: any[];

  constructor(
    private reportService: ReportService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.initChart();

    this.reportService.getPlaceUsageCount([{
      data_source: 'pori'
    }]).subscribe(placeUsage => {
      this.updateChartData(placeUsage.data);
    });
  }

  private initChart() {
    this.translateService.get([
      'reports.events_amount',
      'shared.areas'
    ]).subscribe(msg => {
      this.chartOptions = {
        title: {
          display: true,
          position: 'top',
          fontFamily: '"BergenMono-Regular", "Lucida Console", Monaco, monospace',
          fontSize: '16',
          text: msg['shared.areas']
        },
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              fontFamily: '"BergenMono-Regular", "Lucida Console", Monaco, monospace',
              display: true,
              labelString: msg['reports.events_amount']
            }
          }]
        }
      };

      this.chartData = [
        { data: [], label: 'Series A' }
      ];

      this.chartLabels = [];
      this.chartType = 'horizontalBar';
      this.chartLegend = false;
    });
  }

  private updateChartData(placeUsage: any []) {
    this.chartLabels = placeUsage.map(place => {
      return place.name;
    });

    this.chartData.push({
      data: placeUsage.map(place => {
        return place.count;
      })
    });
  }

  chartHovered(event) {
  }

  chartClicked(event) {
  }

}
