
import {throwError as observableThrowError,  Observable } from 'rxjs';

import {catchError} from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { LoginService } from '@app/services/login.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private translateService: TranslateService
  ) {

  }

  private showError(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 10000
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Find out if user has logged in (API key exists in login service)
    if (this.loginService.apiKey) {
      // Add the API key to requests
      const reqClone = req.clone({
        headers: req.headers.set('Authorization', `Token ${this.loginService.apiKey}`)
      });

      return next.handle(reqClone).pipe(
        catchError(error => {
          this.translateService.get([
            'errors.bad_request',
            'errors.cant_authenticate',
            'shared.ok'
          ]).subscribe(msg => {
            if (error.status === '401') {
              this.showError(msg['errors.cant_authenticate'], msg['shared.ok']);
            }
          });

          return observableThrowError(error);
        }));
    } else {
      // No API key, just pass the interceptor and show any errors (can't connect to API)
      return next.handle(req).pipe(
        catchError(error => {
          this.translateService.get([
            'errors.unknown_error',
            'errors.cant_connect',
            'shared.ok'
          ]).subscribe(msg => {
            if (error.status === 0) {
              this.showError(msg['errors.cant_connect'], msg['shared.ok']);
            }
          });

          console.log(error);
          return observableThrowError(error);
        }));
    }
  }
}
