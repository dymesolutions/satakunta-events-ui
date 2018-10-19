import { Component, OnInit } from '@angular/core';
import { ReportService } from '@app/services/report.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-keyword-usage-count',
  templateUrl: './keyword-usage-count.component.html',
  styleUrls: ['./keyword-usage-count.component.scss']
})
export class KeywordUsageCountComponent implements OnInit {
  chartOptions: any;

  chartLabels: string[];
  chartType: string;
  chartLegend: boolean;

  chartData: any[];

  constructor(private reportService: ReportService, private translateService: TranslateService) {}

  ngOnInit() {
    this.initChart();

    this.reportService
      .getKeywordUsageCount([
        {
          keyword_set: 'pori:topics'
        }
      ])
      .subscribe(keywordUsage => {
        this.updateChartData(keywordUsage.data);
      });
  }

  private initChart() {
    this.translateService.get(['reports.events_amount', 'shared.keywords']).subscribe(msg => {
      this.chartOptions = {
        title: {
          display: true,
          position: 'top',
          fontSize: 16,
          fontFamily: '"BergenMono-Regular", "Lucida Console", Monaco, monospace',
          text: msg['shared.keywords']
        },
        scaleShowVerticalLines: false,
        responsive: true,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                fontFamily: '"BergenMono-Regular", "Lucida Console", Monaco, monospace',
                display: true,
                labelString: msg['reports.events_amount']
              }
            }
          ]
        }
      };
      this.chartData = [{ data: [], label: 'Series A' }];

      this.chartLabels = [];
      this.chartType = 'horizontalBar';
      this.chartLegend = false;
    });
  }

  private updateChartData(keywordUsage: any[]) {
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
