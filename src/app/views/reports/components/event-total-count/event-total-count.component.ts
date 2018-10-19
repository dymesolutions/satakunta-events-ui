import { Component, OnInit } from '@angular/core';
import { ReportService } from '@app/services/report.service';

@Component({
  selector: 'app-event-total-count',
  templateUrl: './event-total-count.component.html',
  styleUrls: ['./event-total-count.component.scss']
})
export class EventTotalCountComponent implements OnInit {

  eventCount: any;
  loading: boolean;

  constructor(
    private reportService: ReportService
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.getEventCount();
  }

  private getEventCount() {
    this.loading = true;
    this.reportService.getEventCount([])
      .subscribe(result => {
        this.eventCount = {
          published: result.published_count,
          unpublished: result.unpublished_count
        };
        this.loading = false;
      }, errors => {
        this.loading = false;
      });
  }
}
