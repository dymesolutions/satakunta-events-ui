import { Component, Input, OnInit } from '@angular/core';
import { IEventMeta } from '@app/interfaces/event-meta';
import { PaginatorService } from '@app/services/paginator.service';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  // Meta object returned by API
  @Input() meta: IEventMeta;
  @Input() itemsPerPage: number;
  @Input() id: string;

  currentPage: number;

  constructor(
    private paginatorService: PaginatorService
  ) {
    this.currentPage = 1;
  }

  ngOnInit() {
  }

  next() {
    this.currentPage += 1;
    this.paginatorService.next(this.currentPage, this.id);
  }

  previous() {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
    this.paginatorService.previous(this.currentPage, this.id);
  }
}
