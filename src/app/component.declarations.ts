import { AppComponent } from '@app/app.component';
import { ConfirmDialogComponent } from '@app/components/dialogs/confirm-dialog/confirm-dialog.component';
import { LoginDialogComponent } from '@app/components/dialogs/login-dialog/login-dialog.component';
import { GmapViewComponent } from '@app/components/gmap/gmap-view/gmap-view.component';
import { LoadingIndicatorComponent } from '@app/components/loading-indicator/loading-indicator.component';
import { LogoFooterComponent } from '@app/components/logo-footer/logo-footer.component';
import { PaginatorComponent } from '@app/components/paginator/paginator.component';
import { TopBarComponent } from '@app/components/top-bar/top-bar.component';
import { MultiLangInputComponent } from '@app/components/values/multi-lang-input/multi-lang-input.component';
import { ApiDataPipe } from '@app/pipes/api-data.pipe';
import { RoundNumberPipe } from '@app/pipes/round-number.pipe';
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
import { AudienceUsageCountComponent } from '@app/views/reports/components/audience-usage-count/audience-usage-count.component';
import { EventTodayCountComponent } from '@app/views/reports/components/event-today-count/event-today-count.component';
import { EventTotalCountComponent } from '@app/views/reports/components/event-total-count/event-total-count.component';
import { KeywordUsageCountComponent } from '@app/views/reports/components/keyword-usage-count/keyword-usage-count.component';
import { PlaceUsageCountComponent } from '@app/views/reports/components/place-usage-count/place-usage-count.component';
import { EventsReportComponent } from '@app/views/reports/events-report/events-report.component';
import { LoginComponent } from '@app/views/users/login/login.component';
import { OrganizationListComponent } from '@app/views/users/organization-list/organization-list.component';
import { RegisterComponent } from '@app/views/users/register/register.component';
import { ResetPasswordComponent } from '@app/views/users/reset-password/reset-password.component';
import { UserListComponent } from '@app/views/users/user-list/user-list.component';
import { UserRegisteredComponent } from '@app/views/users/user-registered/user-registered.component';
import { PrivacyPolicyDialogComponent } from './views/misc/privacy-policy-dialog/privacy-policy-dialog.component';

export const componentDeclarations = [
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
  PrivacyPolicyDialogComponent,
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
];
