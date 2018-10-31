import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { LoginService } from '@app/services/login.service';
import { FormValidationUtil } from '@app/utils/form-validation-util';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime ,  distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent implements OnInit {

  loginWithUsername: boolean;
  loginGroup: FormGroup;
  loginValidationMsgs: any;

  credentialsInvalid: boolean;

  loggingIn: boolean;
  registering: boolean;

  registerGroup: FormGroup;
  registerUser: boolean;
  registerValidationMsgs: any;

  emailExists: boolean;
  usernameExists: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
    this.loginWithUsername = false;
    this.registerUser = false;

    this.usernameExists = false;
    this.emailExists = false;

    this.loginGroup = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.registerGroup = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      passwordAgain: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      firstName: new FormControl('', [

      ]),
      lastName: new FormControl('', [

      ]),
      gdprConsent: new FormControl(false)
    });

    this.credentialsInvalid = false;
    this.loggingIn = false;
  }

  ngOnInit() {
    this.initValidationMessages();
    this.initValueListeners();
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

      this.registerValidationMsgs = {
        username: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }],
        email: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }],
        password: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }, {
          type: 'minlength',
          message: msg['validations.password_must_be_6_chars']
        }],
        passwordAgain: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }, {
          type: 'minlength',
          message: msg['validations.password_must_be_6_chars']
        }]
      };
    });
  }

  private initValueListeners() {
    /*
    this.registerGroup.get('username').valueChanges
      .pipe(distinctUntilChanged())
      .pipe(debounceTime(1000))
      .subscribe(username => {
        if (username.length > 0) {
          this.loginService.getUsernameExists(username)
            .subscribe(result => {
              this.usernameExists = result.exists;
            });
        } else {
          this.usernameExists = false;
        }
      });
      */

    this.registerGroup.get('email').valueChanges
      .pipe(distinctUntilChanged())
      .pipe(debounceTime(1000))
      .subscribe(email => {
        if (email.length > 0) {
          this.loginService.getEmailExists(email)
            .subscribe(result => {
              this.emailExists = result.exists;
            });
        } else {
          this.emailExists = false;
        }
      });
  }

  revealLoginForm() {
    this.loginWithUsername = true;
  }

  revealRegisterForm() {
    this.registerUser = true;
  }

  close() {
    this.dialogRef.close();
  }

  signInWithUsernameAndPassword() {
    this.credentialsInvalid = false;

    if (this.loginGroup.valid) {
      this.loggingIn = true;
      const username = this.loginGroup.get('username').value;
      const password = this.loginGroup.get('password').value;
      this.loginService.loginWithUsernameAndPassword(username, password)
        .subscribe(result => {
          this.loginService.setupLoggedIn(result.key);
          this.loggingIn = false;

          this.dialogRef.close();
        }, errors => {
          if (errors.status === 401) {
            this.loggingIn = false;
            this.credentialsInvalid = true;

            this.translateService.get([
              'errors.credentials_invalid',
              'shared.ok'
            ]).subscribe(msg => {
              this.snackBar.open(msg['errors.credentials_invalid'], msg['shared.ok'], {
                duration: 10000
              });
            });
          }
        });
    } else {
      FormValidationUtil.markFormGroupAsTouched(this.loginGroup);
    }
  }

  private validatePasswords(password: string, passwordAgain: string) {
    let valid = true;

    // Check if passwords match, at least 6 chars

    if (password !== passwordAgain) {
      valid = false;
    }
  }

  submitRegisterUser() {
    this.registering = true;
    this.validatePasswords(
      this.registerGroup.get('password').value,
      this.registerGroup.get('passwordAgain').value
    );

    if (this.registerGroup.valid) {
      if (this.registerGroup.get('gdprConsent').value) {
        this.loginService.registerNewUser({
          // username: this.registerGroup.get('username').value,
          password1: this.registerGroup.get('password').value,
          password2: this.registerGroup.get('passwordAgain').value,
          email: this.registerGroup.get('email').value,
          first_name: this.registerGroup.get('firstName').value,
          last_name: this.registerGroup.get('lastName').value
        }).subscribe(result => {
          this.translateService.get([
            'info.register_confirmation_Sent',
            'shared.ok'
          ]).subscribe(msg => {
            this.snackBar.open(msg['info.register_confirmation_Sent'], msg['shared.ok'], {
              duration: 10000
            });
          });
          this.dialogRef.close();
        }, errors => {
          console.log('Errors', errors);
          this.registering = false;
        });
      } else {
        this.registering = false;
        // Show GDPR consent message if user hasn't checked the field
        this.translateService.get([
          'gdpr.you_must_accept_register',
          'shared.ok'
        ]).subscribe(msg => {
          this.snackBar.open(msg['gdpr.you_must_accept_register'], msg['shared.ok'], { duration: 10000 });
        });
      }
    } else {
      this.registering = false;
      FormValidationUtil.markFormGroupAsTouched(this.registerGroup);
    }
  }
}
