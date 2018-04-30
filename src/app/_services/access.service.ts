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
      routeAccess: {
        users: true,
        useradd: true,
        organizations: true,
        organizationadd: true,
        organizationedit: true,
        resources: true,
        prizes: true,
        prizeadd: true,
        prizeedit: true,
        notifications: true,
        notificationadd: true,
        notificationview: true,
        internshipadd: true,
        internshipedit: true,
        opportunityadd: true,
        opportunityedit: true,
        scholarshipadd: true,
        scholarshipedit: true,
        scholarshipapplicants: true,
        scholarshipapplication: true,
        applicants: true,
        messageboard: true,
        approvals: true,
        keycards: true,
      },
      functionalityAccess: {
        internshipsTab: true,
        scholarshipsTab: true,
        otherOpportunitiesTab: true,
        usersTab: true,
        prizesTab: true,
        notificationsTab: true,
        organizationTab: true,
        resourcesTab: true,
        communitiesTab: true,
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
        newMessage: true,
        scheduleTab: true,
        approvalsTab: true,
        approveRejectButtons: true,
        keycardIndexTab: true,
      }
    },
    key_contact: {
      role: 'key_contact',
      routeAccess: {
        users: true,
        useradd: true,
        resources: true,
        prizes: true,
        internshipadd: true,
        internshipedit: true,
        opportunityadd: true,
        opportunityedit: true,
        scholarshipadd: true,
        scholarshipedit: true,
        notifications: true,
        notificationadd: true,
        notificationview: true,
      },
      functionalityAccess: {
        usersTab: true,
        keyContactsTab: true,
        counselorsTab: true,
        notificationsTab: true,
        resourcesTab: true,
        studentsTab: true,
        newOpportunityButton: true,
        newScholarshipButton: true,
        scholarshipsTab: true,
        internshipsTab: true,
        otherOpportunitiesTab: true,
        newUserButton: true,
        prizesTab: true,
        awardedPrizesIndex: true,
        activateKeycardButton: true,
        scheduleTab: true
      }
    },
    counselor: {
      role: 'counselor',
      routeAccess: {
        users: true,
        prizes: true,
        useradd: true,
        resources: true,
        internshipadd: true,
        internshipedit: true,
        opportunityadd: true,
        opportunityedit: true,
        scholarshipadd: true,
        scholarshipedit: true,
        notificationadd: true,
        notificationview: true,
        notifications: true
      },
      functionalityAccess: {
        usersTab: true,
        studentsTab: true,
        counselorsTab: true,
        keyContactsTab: true,
        notificationsTab: true,
        resourcesTab: true,
        newOpportunityButton: true,
        newScholarshipButton: true,
        scholarshipsTab: true,
        internshipsTab: true,
        otherOpportunitiesTab: true,
        newUserButton: true,
        prizesTab: true,
        awardedPrizesIndex: true,
        activateKeycardButton: true,
      }
    },
    community: {
      role: 'community',
      routeAccess: {
        resources: true,
        internshipadd: true,
        internshipedit: true,
        opportunityadd: true,
        opportunityedit: true,
        scholarshipadd: true,
        scholarshipedit: true
      },
      functionalityAccess: {
        resourcesTab: true,
        newScholarshipButton: true,
        newOpportunityButton: true,
        scholarshipsTab: true,
        internshipsTab: true,
        otherOpportunitiesTab: true
      }
    },
  };

  constructor(public http: Http,
  ) { }

  getAccess(role: string): Model.RolesAccess {
    return <Model.RolesAccess>this.roles[role];
  }

}
