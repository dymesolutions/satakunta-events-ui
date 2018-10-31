import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '@app/services/login.service';
import { Observable } from 'rxjs';

/**
 * This guard checks if user has logged in
 */
@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.loginService.user) {
      return true;
    } else {
      return false;
    }
  }
}
