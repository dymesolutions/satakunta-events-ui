import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { LoginDialogComponent } from '@app/components/dialogs/login-dialog/login-dialog.component';
import { LoginAction } from '@app/enums/login-action';
import { IUser } from '@app/interfaces/user';
import { LoginService } from '@app/services/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {

  isLoggedIn: boolean;
  loggedInUser: IUser;

  private loginSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private loginService: LoginService,
    private router: Router
  ) {
    this.isLoggedIn = false;
  }

  ngOnInit() {
    // Subscribe to login actions so we can handle
    // what the user sees on the top bar
    this.loginSub = this.loginService.userLoginAction
      .subscribe(action => {
        if (action === LoginAction.LOG_IN) {
          this.isLoggedIn = true;
          this.loggedInUser = this.loginService.user;
        } else {
          this.isLoggedIn = false;
        }
      });

    // Set initial user (if found in memory/localstorage)
    if (this.loginService.user) {
      this.loggedInUser = this.loginService.user;
      this.isLoggedIn = true;
    }
  }

  ngOnDestroy() {
    this.loginSub.unsubscribe();
  }

  navigateToAbout() {
    this.router.navigate(['/about']);
  }

  navigateToSearch() {
    this.router.navigate(['/search']);
  }

  navigateToEventCreate() {
    this.router.navigate(['/event', 'create']);
  }

  navigateToManagement() {
    this.router.navigate(['/manage']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  openLoginDialog() {
    this.dialog.open(LoginDialogComponent, {
      width: '40%',
      data: {}
    });
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/']);
  }
}
