import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as Services from '../app.services-list';
import { sharedStylesheetJitUrl } from '@angular/compiler';

@Injectable()
export class AuthGuard implements CanActivate {

  test: boolean;

  constructor(
    private authService: Services.AuthService,
    private router: Router,
  ) { }

  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    this.authService.redirectUrl = state.url;
    if (this.authService.authenticated) {
      return true;
    }
    return false;
  }
}
