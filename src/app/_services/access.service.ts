import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Model } from '../app.models-list';

@Injectable()
export class AccessService {

  private roles: Model.RolesAccess[] = [
    {
      role: 'admin',
      routeAccess: ['users',
        'organizations',
        'organizationadd',
        'resources',
        'prizes',
        'prizeadd',
        'prizeedit',
        'notifications',
        'notificationadd',
        'internshipadd',
        'internshipedit',
        'opportunityadd',
        'opportunityedit',
        'scholarshipadd',
        'scholarshipedit',
        'applicants'],
      functionAccess: ['']
    },
    {
      role: 'keyContact',
      routeAccess: ['users',
        'resources',
        'prizes',
        'notifications'],
      functionAccess: ['']
    },
    {
      role: 'counselor',
      routeAccess: ['users',
        'resources',
        'prizes',
        'notifications'],
      functionAccess: ['']
    },
    {
      role: 'businessOwner',
      routeAccess: ['organizations',
        'resources',
        'prizes'],
      functionAccess: ['']
    },
  ];

  constructor(public http: Http,
  ) { }

  getRoleAccess(role: string): Model.RolesAccess {
    return <Model.RolesAccess>this.roles.find(x => x.role === role);
  }
}