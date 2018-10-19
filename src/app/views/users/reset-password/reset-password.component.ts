import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '@app/services/login.service';
import { FormValidationUtil } from '@app/utils/form-validation-util';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  passwordGroup: FormGroup;
  resetGroup: FormGroup;

  resetEmailSent: boolean;
  sending: boolean;
  verifyingResetKey: boolean;
  resetKeyVerified: boolean;
  passwordMatchError: boolean;

  showEmailForm: boolean;
  showPasswordChangedInfo: boolean;

  emailValidationMsgs: any;
  passwordValidationMsgs: any;

  private resetKey: string;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {
    this.passwordGroup = new FormGroup({
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      passwordAgain: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ]))
    });

    this.resetGroup = new FormGroup({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email
      ]))
    });

    this.resetEmailSent = false;
    this.verifyingResetKey = false;
    this.resetKeyVerified = false;
    this.showEmailForm = false;
    this.passwordMatchError = false;
    this.showPasswordChangedInfo = false;

    this.emailValidationMsgs = {};
    this.passwordValidationMsgs = {};
  }

  ngOnInit() {
    this.route.paramMap
      .subscribe(params => {
        const resetKey = params.get('resetKey');

        if (resetKey) {
          this.verifyingResetKey = true;
          this.showEmailForm = false;

          this.verifyResetKey(resetKey.trim());
        } else {
          this.verifyingResetKey = false;
          this.showEmailForm = true;
        }
      });

    this.passwordGroup.get('password').valueChanges
      .subscribe(value => {
        if (value !== this.passwordGroup.get('passwordAgain').value) {
          this.passwordMatchError = true;
        } else {
          this.passwordMatchError = false;
        }
      });

    this.passwordGroup.get('passwordAgain').valueChanges
      .subscribe(value => {
        if (value !== this.passwordGroup.get('password').value) {
          this.passwordMatchError = true;
        } else {
          this.passwordMatchError = false;
        }
      });

    this.initValidationMessages();
  }

  private initValidationMessages() {
    this.translateService.get([
      'validations.field_is_required',
      'validations.enter_valid_email',
      'validations.password_must_be_6_chars'
    ]).subscribe(msg => {
      this.emailValidationMsgs = {
        email: [{
          type: 'required',
          message: msg['validations.field_is_required']
        }, {
          type: 'email',
          message: msg['validations.enter_valid_email']
        }]
      };

      this.passwordValidationMsgs = {
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

  private verifyResetKey(resetKey: string) {
    this.loginService.verifyResetKey(resetKey)
      .subscribe(result => {
        this.verifyingResetKey = false;
        this.resetKeyVerified = true;
        this.resetKey = resetKey;
      }, errors => {
        this.verifyingResetKey = false;
        this.resetKeyVerified = false;

        if (errors.status === 400) {
          // Expired

        }

      });
  }

  askNewKey() {
    this.resetKeyVerified = false;
    this.showEmailForm = true;
    this.sending = false;
    this.verifyingResetKey = false;
    this.resetEmailSent = false;
  }

  private passwordsMatch() {
    return this.passwordGroup.get('password').value === this.passwordGroup.get('passwordAgain').value;
  }

  changePassword() {
    FormValidationUtil.markFormGroupAsTouched(this.passwordGroup);

    if (this.passwordGroup.valid) {
      if (this.passwordsMatch()) {
        this.passwordMatchError = false;
        this.sending = true;
        this.passwordGroup.disable();

        this.loginService.changePasswordWithResetKey({
          password: this.passwordGroup.get('password').value,
          passwordAgain: this.passwordGroup.get('passwordAgain').value,
          resetKey: this.resetKey
        }).subscribe(result => {
          this.showPasswordChangedInfo = true;
        }, errors => {
          this.showPasswordChangedInfo = false;
          console.log('Errors', errors);
        });
      } else {
        this.passwordMatchError = true;
      }
    }
  }

  submit() {
    FormValidationUtil.markFormGroupAsTouched(this.resetGroup);

    if (this.resetGroup.valid) {
      this.sending = true;
      this.loginService.resetPassword(this.resetGroup.get('email').value)
        .subscribe(result => {
          this.resetEmailSent = true;
        }, errors => {
          this.resetEmailSent = false;

          if (errors.status === 404) {
            this.translateService.get([
              'shared.ok',
              'errors.account_not_found'
            ]).subscribe(msg => {
              this.snackBar.open(msg['errors.account_not_found'], msg['shared.ok'], {
                duration: 10000
              });
            });
          }

          this.sending = false;
        });
    }
  }
}
