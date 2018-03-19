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
        'useradd',
        'organizations',
        'organizationadd',
        'organizationedit',
        'resources',
        'prizes',
        'prizeadd',
        'prizeedit',
        'notifications',
        'notificationadd',
        'notificationview',
        'internshipadd',
        'internshipedit',
        'opportunityadd',
        'opportunityedit',
        'scholarshipadd',
        'scholarshipedit',
        'scholarshipapplicants',
        'applicants'],
      functionAccess: ['']
    },
    {
      role: 'key_contact',
      routeAccess: ['users',
        'resources',
        'prizes',
        'scholarshipadd',
        'scholarshipedit',
        'notifications',
        'notificationadd',
        'notificationview',
        'notifications'],
      functionAccess: ['']
    },
    {
      role: 'counselor',
      routeAccess: ['users',
        'resources',
        'opportunityadd',
        'opportunityedit',
        'prizes',
        'notifications'],
      functionAccess: ['']
    },
    {
      role: 'business_owner',
      routeAccess: ['organizations',
        'resources',
        'prizes',
        'prizeadd',
        'prizeedit',
        'internshipadd',
        'internshipedit',
        'opportunityadd',
        'opportunityedit',
        'scholarshipadd',
        'scholarshipedit',
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