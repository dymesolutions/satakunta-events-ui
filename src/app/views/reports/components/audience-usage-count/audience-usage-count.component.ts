import { Component, OnInit } from '@angular/core';
import { ReportService } from '@app/services/report.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-audience-usage-count',
  templateUrl: './audience-usage-count.component.html',
  styleUrls: ['./audience-usage-count.component.scss']
})
export class AudienceUsageCountComponent implements OnInit {

  chartOptions: any;

  chartLabels: string[];
  chartType: string;
  chartLegend: boolean;

  chartData: any[];

  constructor(
    private reportService: ReportService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.initChart();

    this.reportService.getKeywordUsageCount([{
      keyword_set: 'pori:audiences'
    }])
      .subscribe(keywordUsage => {
        this.updateChartData(keywordUsage.data);
      });
  }

  private initChart() {
    this.translateService.get([
      'reports.events_amount',
      'shared.target_audiences'
    ]).subscribe(msg => {
      this.chartOptions = {
        title: {
          display: true,
          position: 'top',
          fontSize: 16,
          fontFamily: '"BergenMono-Regular", "Lucida Console", Monaco, monospace',
          text: msg['shared.target_audiences']
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

  private updateChartData(keywordUsage: any []) {
    this.chartLabels = keywordUsage.map(keyword => {
      return keyword.name;
    });

    this.chartData.push({
      data: keywordUsage.map(keyword => {
        return keyword.count;
      })
    });
  }

  chartHovered(event) {
    console.log('Hover event', event);
  }

  chartClicked(event) {
    console.log('Hover event', event);
  }
}
