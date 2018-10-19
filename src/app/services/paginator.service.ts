import { Injectable } from '@angular/core';
import { PaginatorAction } from '@app/enums/paginator-action';
import { IPaginatorMessage } from '@app/interfaces/paginator-message';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PaginatorService {

  paginatorSubject: Subject<IPaginatorMessage>;

  constructor() {
    this.paginatorSubject = new Subject<IPaginatorMessage>();
  }

  get paginator() {
    return this.paginatorSubject.asObservable();
  }

  next(nextPage: number, id: string) {
    this.paginatorSubject.next({
      actionType: PaginatorAction.Next,
      page: nextPage,
      id: id
    });
  }

  previous(previousPage: number, id: string) {
    this.paginatorSubject.next({
      actionType: PaginatorAction.Previous,
      page: previousPage,
      id: id
    });
  }
}
