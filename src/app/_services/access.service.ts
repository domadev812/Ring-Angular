import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Model } from '../app.models-list';

@Injectable()
export class AccessService {

  private roles: Model.RolesAccess[] = [
    // tslint:disable-next-line:max-line-length
    { role: 'admin', routeAccess: ['/users', '/organizations', '/resources', '/prizes', '/notifications', '/notificationadd', '/internshipadd', '/opportunityadd'], functionAccess: [''] },
    { role: 'keyContact', routeAccess: ['/users', '/resources', '/prizes', '/notifications'], functionAccess: [''] },
    { role: 'counselor', routeAccess: ['/users', '/resources', '/prizes', '/notifications'], functionAccess: [''] },
    { role: 'businessOwner', routeAccess: ['/organizations', '/resources', '/prizes'], functionAccess: [''] },
  ];

  constructor(public http: Http,
  ) { }

  getRoleAccess(role: string): Model.RolesAccess {
    return <Model.RolesAccess>this.roles.find(x => x.role === role);
  }
}