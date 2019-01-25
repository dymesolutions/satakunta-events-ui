import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID } from '@angular/core';
import { AdminGuard } from '@app/guards/admin.guard';
import { AuthGuard } from '@app/guards/auth.guard';
import { ApiKeyInterceptor } from '@app/interceptors/apikey-interceptor';
import { materialServices } from '@app/material.modules';
import { ApiDataPipe } from '@app/pipes/api-data.pipe';
import { EventService } from '@app/services/event.service';
import { GmapService } from '@app/services/gmap.service';
import { ImageService } from '@app/services/image.service';
import { KeywordSetService } from '@app/services/keyword-set.service';
import { KeywordService } from '@app/services/keyword.service';
import { LoginService } from '@app/services/login.service';
import { OrganizationService } from '@app/services/organization.service';
import { PaginatorService } from '@app/services/paginator.service';
import { PlaceService } from '@app/services/place.service';
import { ReportService } from '@app/services/report.service';
import { UserService } from '@app/services/user.service';

export const serviceProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ApiKeyInterceptor, multi: true },
  { provide: LOCALE_ID, useValue: 'fi-FI' },
  AdminGuard,
  ApiDataPipe,
  AuthGuard,
  DatePipe,
  EventService,
  GmapService,
  ImageService,
  KeywordService,
  KeywordSetService,
  LoginService,
  materialServices,
  OrganizationService,
  PaginatorService,
  PlaceService,
  ReportService,
  UserService
];
