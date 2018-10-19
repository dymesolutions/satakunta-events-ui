import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localeFi from '@angular/common/locales/fi';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ConfirmDialogComponent } from '@app/components/dialogs/confirm-dialog/confirm-dialog.component';
import { LoginDialogComponent } from '@app/components/dialogs/login-dialog/login-dialog.component';
import { GmapViewComponent } from '@app/components/gmap/gmap-view/gmap-view.component';
import { LoadingIndicatorComponent } from '@app/components/loading-indicator/loading-indicator.component';
import { LogoFooterComponent } from '@app/components/logo-footer/logo-footer.component';
import { PaginatorComponent } from '@app/components/paginator/paginator.component';
import { TopBarComponent } from '@app/components/top-bar/top-bar.component';
import { MultiLangInputComponent } from '@app/components/values/multi-lang-input/multi-lang-input.component';
import { AdminGuard } from '@app/guards/admin.guard';
import { AuthGuard } from '@app/guards/auth.guard';
import { ApiKeyInterceptor } from '@app/interceptors/apikey-interceptor';
import { materialModules, materialServices } from '@app/material.modules';
import { ApiDataPipe } from '@app/pipes/api-data.pipe';
import { RoundNumberPipe } from '@app/pipes/round-number.pipe';
import { routes } from '@app/routes';
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
import { AdminPanelComponent } from '@app/views/admin/admin-panel/admin-panel.component';
import { PageNotFoundComponent } from '@app/views/errors/page-not-found/page-not-found.component';
import { EventAddImageDialogComponent } from '@app/views/events/event-add-image-dialog/event-add-image-dialog.component';
import { EventCreateComponent } from '@app/views/events/event-create/event-create.component';
import { EventCreatedComponent } from '@app/views/events/event-created/event-created.component';
import { EventSearchComponent } from '@app/views/events/event-search/event-search.component';
import { EventViewComponent } from '@app/views/events/event-view/event-view.component';
import { EventDetailsComponent } from '@app/views/events/manage/event-details/event-details.component';
import { EventListComponent } from '@app/views/events/manage/event-list/event-list.component';
import { KeywordListComponent } from '@app/views/keywords/keyword-list/keyword-list.component';
import { KeywordSetListComponent } from '@app/views/keywords/keyword-set-list/keyword-set-list.component';
import { ManagePanelComponent } from '@app/views/manage/manage-panel/manage-panel.component';
import { AboutComponent } from '@app/views/misc/about/about.component';
import { PrivacyPolicyComponent } from '@app/views/misc/privacy-policy/privacy-policy.component';
import { VerifyEmailComponent } from '@app/views/misc/verify-email/verify-email.component';
import { EventsReportComponent } from '@app/views/reports/events-report/events-report.component';
import { LoginComponent } from '@app/views/users/login/login.component';
import { OrganizationListComponent } from '@app/views/users/organization-list/organization-list.component';
import { RegisterComponent } from '@app/views/users/register/register.component';
import { ResetPasswordComponent } from '@app/views/users/reset-password/reset-password.component';
import { UserListComponent } from '@app/views/users/user-list/user-list.component';
import { UserRegisteredComponent } from '@app/views/users/user-registered/user-registered.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'environments/environment';
import 'hammerjs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { AudienceUsageCountComponent } from './views/reports/components/audience-usage-count/audience-usage-count.component';
import { EventTodayCountComponent } from './views/reports/components/event-today-count/event-today-count.component';
import { EventTotalCountComponent } from './views/reports/components/event-total-count/event-total-count.component';
import { KeywordUsageCountComponent } from './views/reports/components/keyword-usage-count/keyword-usage-count.component';
import { PlaceUsageCountComponent } from './views/reports/components/place-usage-count/place-usage-count.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', `.json?v=${environment.build}`);
}

registerLocaleData(localeFi, 'fi');

@NgModule({
  declarations: [
    AboutComponent,
    ApiDataPipe,
    AppComponent,
    ConfirmDialogComponent,
    EventAddImageDialogComponent,
    EventCreateComponent,
    EventListComponent,
    EventSearchComponent,
    EventViewComponent,
    GmapViewComponent,
    LoadingIndicatorComponent,
    LoginDialogComponent,
    MultiLangInputComponent,
    PageNotFoundComponent,
    PaginatorComponent,
    TopBarComponent,
    VerifyEmailComponent,
    EventCreatedComponent,
    PrivacyPolicyComponent,
    UserListComponent,
    LoginComponent,
    RegisterComponent,
    EventDetailsComponent,
    RoundNumberPipe,
    OrganizationListComponent,
    KeywordListComponent,
    KeywordSetListComponent,
    UserRegisteredComponent,
    ResetPasswordComponent,
    LogoFooterComponent,
    AdminPanelComponent,
    ManagePanelComponent,
    EventsReportComponent,
    EventTotalCountComponent,
    EventTodayCountComponent,
    KeywordUsageCountComponent,
    AudienceUsageCountComponent,
    PlaceUsageCountComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    materialModules,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiKeyInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'fi-FI' },
    AdminGuard,
    AuthGuard,
    ApiDataPipe,
    DatePipe,
    GmapService,
    ImageService,
    KeywordService,
    KeywordSetService,
    LoginService,
    EventService,
    materialServices,
    OrganizationService,
    PaginatorService,
    PlaceService,
    ReportService,
    UserService
  ],
  entryComponents: [
    ConfirmDialogComponent,
    EventAddImageDialogComponent,
    LoginDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
