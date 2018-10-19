import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReportService } from '@app/services/report.service';
import * as moment from 'moment';

@Component({
  selector: 'app-event-today-count',
  templateUrl: './event-today-count.component.html',
  styleUrls: ['./event-today-count.component.scss']
})
export class EventTodayCountComponent implements OnInit {

  eventCount: any;
  loading: boolean;

  constructor(
    private reportService: ReportService,
    private datePipe: DatePipe
  ) {
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.reportService.getEventCount([{
      created_time: moment()
    }])
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
