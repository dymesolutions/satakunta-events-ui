import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '@app/services/login.service';
import { Observable } from 'rxjs';

/**
 * This guard checks if the user is admin/staff
 */
@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private loginService: LoginService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const user = this.loginService.user;

    if (user && user.is_superuser) {
      return true;
    } else {
      return false;
    }
  }
}
