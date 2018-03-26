import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as Services from '../app.services-list';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(
    private authService: Services.AuthService,
    private currentUserService: Services.CurrentUserService,
    private accessService: Services.AccessService,
  ) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    try {
      let user = await this.currentUserService.getCurrentUser(this.authService);
      for (let role of user.roles) {
        let userRoles = this.accessService.getAccess(role);
        if (userRoles.routeAccess[state.url.split('/')[1]]) {
          return true;
        }
        return false;
      }
    } catch (err) {
      if (err) {
        console.log(err);
        this.currentUserService.clearCurrentUserPromise();
      }
    }
  }
}
