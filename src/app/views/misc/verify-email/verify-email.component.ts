import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '@app/services/login.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {

  verifying: boolean; // Used for displaying loading indicator
  verified: boolean;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {
    this.verifying = false;
    this.verified = false;
  }

  ngOnInit() {
    this.route.params
      .subscribe(param => {
        const key = param['key'];

        this.verifying = true;

        this.loginService.verifyEmail(key)
          .subscribe(result => {
            this.verifying = false;
            this.verified = true;
          }, errors => {
            if (errors.status === 404) {
              this.verifying = false;
            }
          });
      });
  }

}
