import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localeFi from '@angular/common/locales/fi';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { componentDeclarations } from '@app/component.declarations';
import { ConfirmDialogComponent } from '@app/components/dialogs/confirm-dialog/confirm-dialog.component';
import { LoginDialogComponent } from '@app/components/dialogs/login-dialog/login-dialog.component';
import { materialModules } from '@app/material.modules';
import { routes } from '@app/routes';
import { serviceProviders } from '@app/service.providers';
import { EventAddImageDialogComponent } from '@app/views/events/event-add-image-dialog/event-add-image-dialog.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from 'environments/environment';
import 'hammerjs';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { PrivacyPolicyDialogComponent } from './views/misc/privacy-policy-dialog/privacy-policy-dialog.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/',
    `.json?v=${environment.build}`
  );
}

registerLocaleData(localeFi, 'fi');

@NgModule({
  declarations: componentDeclarations,
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ChartsModule,
    FormsModule,
    HttpClientModule,
    materialModules,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: serviceProviders,
  entryComponents: [
    ConfirmDialogComponent,
    PrivacyPolicyDialogComponent,
    EventAddImageDialogComponent,
    LoginDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
