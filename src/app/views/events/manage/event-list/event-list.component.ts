import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '@app/components/dialogs/confirm-dialog/confirm-dialog.component';
import { IEventMeta } from '@app/interfaces/event-meta';
import { IFetchEventApiFormat } from '@app/interfaces/fetch-event-api-format';
import { EventService } from '@app/services/event.service';
import { LoginService } from '@app/services/login.service';
import { PaginatorService } from '@app/services/paginator.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit, OnDestroy {
  eventsPublished: MatTableDataSource<IFetchEventApiFormat>;
  eventsUnpublished: MatTableDataSource<IFetchEventApiFormat>;
  displayedColumns: any[];
  eventsPublishedMetadata: IEventMeta;
  eventsUnpublishedMetadata: IEventMeta;
  loadingEvents: boolean;
  loadingUnpublishedEvents: boolean;
  isAdmin: boolean;
  isStaff: boolean;

  // Paginator:
  eventsPublishedPage: number;
  eventsUnpublishedPage: number;
  pageSize: number;
  private paginatorSub: Subscription;

  // Workaround to display accordion inside tabs correctly,
  // check in HTML which tab is displayed and show accordion.
  tabIndex: number;

  constructor(
    private dialog: MatDialog,
    private eventService: EventService,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private router: Router,
    private paginatorService: PaginatorService,
    private translateService: TranslateService
  ) {
    this.loadingEvents = false;
    this.loadingUnpublishedEvents = false;
    this.eventsPublishedPage = 1;
    this.eventsUnpublishedPage = 1;
    this.pageSize = 15;

    this.isAdmin = false;
    this.isStaff = false;
  }

  ngOnInit() {
    if (this.loginService.user.is_staff || this.loginService.user.is_superuser) {
      // Moderator (staff) view
      // this.displayedColumns = ['dateCreated', 'name', 'starts', 'ends', 'user', 'actions'];
      this.displayedColumns = ['dateCreated', 'name'];
      this.isStaff = true;
    } else {
      // Basic view
      this.displayedColumns = ['dateCreated', 'name', 'starts', 'ends', 'actions'];
      this.isStaff = false;
      this.isAdmin = false;
    }

    if (this.loginService.user.is_superuser) {
      this.isAdmin = true;
    }

    this.getPublishedEvents();
    this.getUnpublishedEvents();

    this.paginatorSub = this.paginatorService.paginator.subscribe(message => {
      if (message.id === 'EventsPublished') {
        this.eventsPublishedPage = message.page;
        this.getPublishedEvents();
      } else {
        this.eventsUnpublishedPage = message.page;
        this.getUnpublishedEvents();
      }
    });

    this.tabIndex = 0;
  }

  ngOnDestroy() {
    this.paginatorSub.unsubscribe();
  }

  private getPublishedEvents() {
    this.loadingEvents = true;

    if (this.isStaff) {
      this.eventService.getAllForManager([
        { page: this.eventsPublishedPage },
        { page_size: this.pageSize },
        { include: 'keywords,location,audience' }
      ]).subscribe(
        events => {
          this.handleResults(events, true);
        },
        error => {
          this.loadingEvents = false;
        }
      );
    } else {
      this.eventService.getAllByUser([
        { page: this.eventsPublishedPage },
        { page_size: this.pageSize },
        { include: 'keywords,location,audience' },
        { user_id: this.loginService.user.id }
      ]).subscribe(
        events => {
          this.handleResults(events, true);
        },
        error => {
          this.loadingEvents = false;
        }
      );
    }
  }

  private getUnpublishedEvents() {
    this.loadingUnpublishedEvents = true;
    if (this.isStaff) {
      this.eventService.getAllForManager([
        { page: this.eventsUnpublishedPage },
        { page_size: this.pageSize },
        { include: 'keywords,location,audience' },
        { published: false }
      ]).subscribe(
        events => {
          this.handleResults(events, false);
        },
        error => {
          this.loadingUnpublishedEvents = false;
        }
      );
    } else {
      this.eventService.getAllByUser([
        { page: this.eventsUnpublishedPage },
        { user_id: this.loginService.user.id },
        { page_size: this.pageSize },
        { include: 'keywords,location,audience' },
        { published: false }
      ]).subscribe(
        events => {
          this.handleResults(events, false);
        },
        error => {
          this.loadingUnpublishedEvents = false;
        }
      );
    }
  }

  private handleResults(events: any, published: boolean) {
    if (published) {
      this.eventsPublishedMetadata = events.meta;
      this.eventsPublished = new MatTableDataSource(events.data);
      this.loadingEvents = false;
    } else {
      this.eventsUnpublishedMetadata = events.meta;
      this.eventsUnpublished = new MatTableDataSource(events.data);
      this.loadingUnpublishedEvents = false;
    }
  }

  navigateToEdit(eventId: string) {
    this.router.navigate(['/event', 'edit', eventId]);
  }

  publish(eventId: string) {
    this.translateService
      .get([
        'confirm.do_you_want_to_publish',
        'confirm.event',
        'shared.ok'
      ])
      .subscribe(msg => {
        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
          width: '30%',
          data: {
            confirmTitle: msg['confirm.do_you_want_to_publish'] + msg['confirm.event'],
            name: ''
          }
        });

        confirmRef.afterClosed().subscribe(confirmed => {
          if (confirmed) {
            this.eventService.publish(eventId)
              .subscribe(result => {
                const event = this.eventsUnpublished.data.filter(eventData => {
                  return eventData.id === eventId;
                });

                this.eventsUnpublished.data = this.eventsUnpublished.data.filter(eventData => {
                  return eventData.id !== eventId;
                });

                this.eventsPublished.data.unshift(event[0]);
              });
          }
        });
      });
  }

  search() {

  }

  // Called with selectedIndexChange
  onTabChanged(event) {
    this.tabIndex = event.index;
  }

  updateUnpublishedEvents() {
    this.getUnpublishedEvents();
  }

  updatePublishedEvents() {
    this.getPublishedEvents();
  }

  delete(event: IFetchEventApiFormat) {
    this.translateService
      .get([
        'confirm.do_you_want_to_remove',
        'confirm.event',
        'errors.event_cant_be_deleted',
        'events.event_removed_successfully',
        'shared.ok'
      ])
      .subscribe(msg => {
        const confirmRef = this.dialog.open(ConfirmDialogComponent, {
          width: '30%',
          data: {
            confirmTitle: msg['confirm.do_you_want_to_remove'] + msg['confirm.event'] + ':',
            name: event.name.fi
          }
        });

        confirmRef.afterClosed().subscribe(confirmed => {
          if (confirmed) {
            this.eventService.delete(event.id).subscribe(
              result => {
                this.eventsPublished.data = this.eventsPublished.data.filter(eventData => {
                  return eventData.id !== event.id;
                });

                this.eventsUnpublished.data = this.eventsUnpublished.data.filter(eventData => {
                  return eventData.id !== event.id;
                });

                this.snackBar.open(msg['events.event_removed_successfully'], msg['shared.ok'], {
                  duration: 3000
                });
              },
              errors => {
                this.snackBar.open(msg['errors.event_cant_be_deleted'], msg['shared.ok'], {
                  duration: 3000
                });
              }
            );
          }
        });
      });
  }
}
