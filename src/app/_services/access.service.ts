import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Model } from '../app.models-list';
import { Roles } from '../_models/roles-access.model';

@Injectable()
export class AccessService {

  //TODO: RolesAccess from array to object
  private roles: Roles = {
    admin: {
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
        'scholarshipapplication',
        'applicants'],
      functionalityAccess: {
        internshipsTab: true,
        scholarshipsTab: true,
        otherOpportunitiesTab: true,
        usersTab: true,
        prizesTab: true,
        notificationsTab: true,
        organizationTab: true,
        resourcesTab: true,
        businessOwnersTab: true,
        keyContactsTab: true,
        studentsTab: true,
        counselorsTab: true,
        newPrizeButton: true,
        awardedCsvButton: true,
        activateKeycardButton: true,
        newInternshipButton: true,
        newOpportunityButton: true,
        newScholarshipButton: true,
        newUserButton: true,
        awardedPrizesIndex: true,

      }
    },
    key_contact: {
      role: 'key_contact',
      routeAccess: ['users',
        'useradd',
        'resources',
        'prizes',
        'scholarshipadd',
        'scholarshipedit',
        'notifications',
        'notificationadd',
        'notificationview',
        'notifications'],
      functionalityAccess: {
        scholarshipsTab: true,
        usersTab: true,
        prizesTab: true,
        notificationsTab: true,
        resourcesTab: true,
        activateKeycardButton: true,
        newScholarshipButton: true,
        newUserButton: true,
        counselorsTab: true,
        awardedPrizesIndex: true,
        studentsTab: true,
      }
    },
    counselor: {
      role: 'counselor',
      routeAccess: ['users',
        'prizes',
        'useradd',
        'resources',
        'opportunityadd',
        'opportunityedit',
        'notificationadd',
        'notificationview',
        'notifications'],
      functionalityAccess: {
        internshipsTab: true,
        otherOpportunitiesTab: true,
        usersTab: true,
        notificationsTab: true,
        resourcesTab: true,
        studentsTab: true,
        newOpportunityButton: true,
        newUserButton: true,
        prizesTab: true,
        awardedPrizesIndex: true,
      }
    },
    business_owner: {
      role: 'business_owner',
      routeAccess: ['resources',
        'internshipadd',
        'internshipedit',
        'opportunityadd',
        'opportunityedit',
        'scholarshipadd',
        'scholarshipedit',
        'prizes'],
      functionalityAccess: {
        scholarshipsTab: true,
        internshipsTab: true,
        resourcesTab: true,
        newScholarshipButton: true,
        otherOpportunitiesTab: true,
        prizesTab: true,
      }
    },
  };

  constructor(public http: Http,
  ) { }

  //TODO: rename to getAccess
  getRoleAccess(role: string): Model.RolesAccess {
    return <Model.RolesAccess>this.roles[role];
  }

}
