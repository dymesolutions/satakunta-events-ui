import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { TransformType } from '@app/enums/transform-type';
import { IEventMeta } from '@app/interfaces/event-meta';
import { Event } from '@app/models/event';
import { Place } from '@app/models/place';
import { ApiDataPipe } from '@app/pipes/api-data.pipe';
import { EventService } from '@app/services/event.service';
import { PlaceService } from '@app/services/place.service';

@Component({
  selector: 'app-event-search',
  templateUrl: './event-search.component.html',
  styleUrls: ['./event-search.component.scss']
})
export class EventSearchComponent implements OnInit, OnDestroy {

  areas: Place[];
  events: Event[];
  searchQuery: FormControl;
  startTime: FormControl;
  endTime: FormControl;
  loading: boolean;
  sortingBy: string;
  listView: boolean;
  selectedArea: Place;

  // Paginator specific:
  eventMeta: IEventMeta;
  private page: number;

  constructor(
    private apiDataPipe: ApiDataPipe,
    private eventService: EventService,
    private placeService: PlaceService,
    private router: Router
  ) {
    this.startTime = new FormControl();
    this.endTime = new FormControl();
    this.searchQuery = new FormControl();
    this.page = 1;
    this.listView = true;
  }

  ngOnInit() {
    this.loading = false;
    this.getAllPlaces();
  }

  ngOnDestroy() {
  }

  /**
   * Simply just empty the list of events when searching for new ones
   */
  private clearEvents() {
    this.page = 1;
    this.events = [];
  }

  private getAllPlaces() {
    this.placeService.getAll([{
      page_size: 50,
      data_source: 'pori'
    }]).subscribe(places => {
      this.areas = places.data.map(place => {
        return {
          id: place.id,
          name: place.name.fi
        };
      });

      this.areas.unshift({
        id: 'system:all',
        name: '-- Kaikki --'
      });

      this.selectedArea = this.areas[0];
    });
  }

  private getAllEvents() {
    this.loading = true;

    const parameters: any[] = [];

    // Use push to trick type inference ()
    parameters.push(
      { text: this.searchQuery.value },
      { start: this.startTime.value },
      { end: this.endTime.value },
      { page: this.page },
      { page_size: 9 }
    );

    if (this.sortingBy !== undefined) {
      parameters.push({
        sort: this.sortingBy
      });
    }

    if (this.selectedArea !== undefined && this.selectedArea.id !== 'system:all') {
      parameters.push({
        location: this.selectedArea.id
      });
    }

    return this.eventService.getAll(parameters);
  }

  navigateToEvent(eventId: string) {
    this.router.navigate(['/event', eventId]);
  }

  viewAsList() {
    this.listView = true;
  }

  viewAsGrid() {
    this.listView = false;
  }

  showMore() {
    this.page = this.page + 1;
    this.loading = true;

    this.getAllEvents()
      .subscribe(response => {
        this.eventMeta = response.meta;
        if (response.data.length > 0) {
          this.loading = false;
          this.events = this.events.concat(this.apiDataPipe.transform(response.data, TransformType.ToUI));
        } else {
          this.loading = false;
        }
      }, errors => {
        console.log(errors);
        this.loading = false;
      });
  }

  search() {
    this.clearEvents();
    this.getAllEvents()
      .subscribe(response => {
        this.eventMeta = response.meta;
        this.apiDataPipe.transform(response.data, TransformType.ToUI);
        this.events = this.apiDataPipe.transform(response.data, TransformType.ToUI);
        this.loading = false;
      }, error => {
        console.log('Error', error);
        this.loading = false;
      });
  }
}
