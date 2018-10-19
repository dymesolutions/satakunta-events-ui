import { Component, OnInit } from '@angular/core';
import { IOverviewReport } from '@app/interfaces/overview-report';
import { PlaceService } from '@app/services/place.service';
import { ReportService } from '@app/services/report.service';

@Component({
  selector: 'app-events-report',
  templateUrl: './events-report.component.html',
  styleUrls: ['./events-report.component.scss']
})
export class EventsReportComponent implements OnInit {
  report: IOverviewReport;
  places: any[];

  constructor(private reportService: ReportService, private placeService: PlaceService) {}

  ngOnInit() {
    this.report = {
      total_events: 192
    };

    this.getPlaces();
  }

  private getPlaces() {
    this.placeService.getAll([]).subscribe(places => {
      this.places = places;
    });
  }

  onTabChanged(event) {
    console.log('Tab change', event);
  }
}
