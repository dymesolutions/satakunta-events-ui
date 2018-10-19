import { AdminGuard } from '@app/guards/admin.guard';
import { AuthGuard } from '@app/guards/auth.guard';
import { PageNotFoundComponent } from '@app/views/errors/page-not-found/page-not-found.component';
import { EventCreateComponent } from '@app/views/events/event-create/event-create.component';
import { EventCreatedComponent } from '@app/views/events/event-created/event-created.component';
import { EventSearchComponent } from '@app/views/events/event-search/event-search.component';
import { EventViewComponent } from '@app/views/events/event-view/event-view.component';
import { ManagePanelComponent } from '@app/views/manage/manage-panel/manage-panel.component';
import { AboutComponent } from '@app/views/misc/about/about.component';
import { PrivacyPolicyComponent } from '@app/views/misc/privacy-policy/privacy-policy.component';
import { VerifyEmailComponent } from '@app/views/misc/verify-email/verify-email.component';
import { EventsReportComponent } from '@app/views/reports/events-report/events-report.component';
import { LoginComponent } from '@app/views/users/login/login.component';
import { RegisterComponent } from '@app/views/users/register/register.component';
import { ResetPasswordComponent } from '@app/views/users/reset-password/reset-password.component';
import { UserRegisteredComponent } from '@app/views/users/user-registered/user-registered.component';

export const routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'search', component: EventSearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'registered', component: UserRegisteredComponent },
  { path: 'event/create', component: EventCreateComponent, canActivate: [AuthGuard] },
  { path: 'event/created', component: EventCreatedComponent, canActivate: [AuthGuard] },
  { path: 'manage', component: ManagePanelComponent, canActivate: [AuthGuard] },
  { path: 'manage/event/list', redirectTo: '/manage', canActivate: [AuthGuard] },
  { path: 'manage/user/list', redirectTo: '/manage', canActivate: [AuthGuard, AdminGuard] },
  { path: 'manage/keyword/list', redirectTo: '/manage', canActivate: [AuthGuard, AdminGuard] },
  { path: 'report/event', component: EventsReportComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'event/edit/:id', component: EventCreateComponent, canActivate: [AuthGuard] },
  { path: 'event/:id', component: EventViewComponent },
  { path: 'verify/email/:key', component: VerifyEmailComponent },
  { path: 'reset/password', component: ResetPasswordComponent },
  { path: 'reset/password/:resetKey', component: ResetPasswordComponent },
  { path: '**', component: PageNotFoundComponent },
];

