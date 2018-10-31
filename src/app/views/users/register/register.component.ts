import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { LoginService } from '@app/services/login.service';
import { FormValidationUtil } from '@app/utils/form-validation-util';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime ,  distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerGroup: FormGroup;
  registerValidationMsgs: any;

  emailExists: boolean;
  usernameExists: boolean;
  registering: boolean;

  constructor(
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private router: Router,
    private translateService: TranslateService
  ) {
    this.usernameExists = false;
    this.emailExists = false;
    this.registering = false;

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

            this.router.navigate(['/registered']);
          });
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
