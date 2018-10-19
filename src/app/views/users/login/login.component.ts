import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginAction } from '@app/enums/login-action';
import { LoginService } from '@app/services/login.service';
import { FormValidationUtil } from '@app/utils/form-validation-util';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  @ViewChild('buttonSignIn') buttonSignIn: ElementRef;
  credentialsInvalid: boolean;
  loginWithUsername: boolean;
  loggingIn: boolean;

  loginGroup: FormGroup;
  loginValidationMsgs: any;

  loginButtonValue: string;

  private userLoggedInSub: Subscription;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
    this.loginWithUsername = false;
    this.credentialsInvalid = false;
    this.loggingIn = false;

    this.loginGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    // Note that text is changed when button is pressed
    this.translateService.get([
      'shared.sign_in'
    ]).subscribe(msg => {
      this.loginButtonValue = msg['shared.sign_in'];
    });
  }

  ngOnInit() {
    if (this.loginService.user) {
      this.router.navigate(['/manage', 'event', 'list']);
    }

    this.initValidationMessages();
    this.route.queryParamMap
      .subscribe(params => {
        const next = params.get('next');

        // this.router.navigate([next]);
      });

    this.userLoggedInSub = this.loginService.userLoginAction
      .subscribe(action => {
        if (action === LoginAction.LOG_IN) {
          // Routing to manage page needs to be set here
          // to wait that user has logged in
          this.router.navigate(['/manage/event/list']);
        }
      });
  }

  ngOnDestroy() {
    this.userLoggedInSub.unsubscribe();
  }

  private initValidationMessages() {
    this.translateService.get([
      'validations.field_is_required',
      'validations.password_must_be_6_chars'
    ]).subscribe(msg => {
      this.loginValidationMsgs = {
        username: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }],
        password: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }]
      };
    });
  }

  revealLoginForm() {

  }

  revealRegisterForm() {

  }

  register() {

  }

  private changeLoginButtonText(loggingIn: boolean) {
    if (loggingIn) {
      this.loginButtonValue = this.translateService.instant('shared.signing_in');
    } else {
      this.loginButtonValue = this.translateService.instant('shared.sign_in');
    }
  }

  private toggleFields(loggingIn: boolean) {
    if (loggingIn) {
      this.loginGroup.get('username').disable();
      this.loginGroup.get('password').disable();
    } else {
      this.loginGroup.get('username').enable();
      this.loginGroup.get('password').enable();
    }
  }

  signInWithUsernameAndPassword() {
    this.credentialsInvalid = false;

    if (this.loginGroup.valid) {

      this.changeLoginButtonText(true);
      this.toggleFields(true);
      this.loggingIn = true;

      const username = this.loginGroup.get('username').value;
      const password = this.loginGroup.get('password').value;
      this.loginService.loginWithUsernameAndPassword(username, password)
        .subscribe(result => {
          this.loginService.setupLoggedIn(result.key);
        }, errors => {
          console.log('Error', errors);
          if (errors.status === 401) {

            this.credentialsInvalid = true;

            this.changeLoginButtonText(false);
            this.toggleFields(false);
            this.loggingIn = false;

            this.translateService.get([
              'errors.credentials_invalid',
              'shared.ok'
            ]).subscribe(msg => {
              this.snackBar.open(msg['errors.credentials_invalid'], msg['shared.ok'], {
                duration: 10000
              });
            });
          } else {
            this.loggingIn = false;
          }
        });
    } else {
      FormValidationUtil.markFormGroupAsTouched(this.loginGroup);
    }
  }
}
