
export class RolesAccess {
  role: string;
  routeAccess: Array<string>;
  functionalityAccess: FunctionalityAccess;
}

export class Roles {
  admin: RolesAccess;
  key_contact: RolesAccess;
  business_owner: RolesAccess;
  counselor: RolesAccess;
}

export class FunctionalityAccess {
  internshipsTab?: boolean;
  scholarshipsTab?: boolean;
  otherOpportunitiesTab?: boolean;
  usersTab?: boolean;
  prizesTab?: boolean;
  organizationTab?: boolean;
  notificationsTab?: boolean;
  resourcesTab?: boolean;
  studentsTab?: boolean;
  keyContactsTab?: boolean;
  counselorsTab?: boolean;
  businessOwnersTab?: boolean;
  newPrizeButton?: boolean;
  awardedCsvButton?: boolean;
  activateKeycardButton?: boolean;
  newScholarshipButton?: boolean;
  newInternshipButton?: boolean;
  newOpportunityButton?: boolean;
  newUserButton?: boolean;
  awardedPrizesIndex?: boolean;


}