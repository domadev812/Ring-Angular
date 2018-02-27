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
      let user = await this.currentUserService.getCurrentUser(this.authService, true);
      for (let role of user.roles ){
        let userRoles = this.accessService.getRoleAccess(role);
        if (userRoles.routeAccess.find(x => x === state.url)) {
          return true;
        }
        return false;
      }
    }catch (err) {
      if (err) {
        console.log('ERROR');
      }
    }
  }
}
