import { Component, Input, OnInit } from '@angular/core';
import { IFetchEventApiFormat } from '@app/interfaces/fetch-event-api-format';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {

  @Input() event: IFetchEventApiFormat;

  constructor() { }

  ngOnInit() {
  }

}
