import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IFetchEventApiFormat } from '@app/interfaces/fetch-event-api-format';
import { EventService } from '@app/services/event.service';
import { GmapService } from '@app/services/gmap.service';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit {

  event: IFetchEventApiFormat;

  constructor(
    private eventService: EventService,
    private gMapService: GmapService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        this.getEvent(params.get('id'));
      });
  }

  private setMapCenter(event: IFetchEventApiFormat) {
    if (event.position) {
      this.gMapService.centerMap(event.position);
    } else {
      if (event.location_extra_info.fi.length > 0) {
        this.gMapService.geocode(event.location_extra_info.fi);
      } else {
      }
    }
  }

  private getEvent(eventId: string) {
    this.eventService.getById(eventId, [{
      include: 'keywords,location,audience'
    }])
      .subscribe(event => {
        this.event = event;

        this.setMapCenter(event);
      }, errors => {
        console.log('Errors', errors);
      });
  }

}
