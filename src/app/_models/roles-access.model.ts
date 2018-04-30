
export class RolesAccess {
  role: string;
  routeAccess: RouteAccess;
  functionalityAccess: FunctionalityAccess;
}

export class Roles {
  admin: RolesAccess;
  key_contact: RolesAccess;
  community: RolesAccess;
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
  communitiesTab?: boolean;
  newPrizeButton?: boolean;
  awardedCsvButton?: boolean;
  activateKeycardButton?: boolean;
  newScholarshipButton?: boolean;
  newInternshipButton?: boolean;
  newOpportunityButton?: boolean;
  newUserButton?: boolean;
  awardedPrizesIndex?: boolean;
  newMessage?: boolean;
  scheduleTab?: boolean;
  approvalsTab?: boolean;
  approveRejectButtons?: boolean;
  keycardIndexTab?: boolean;
}

export class RouteAccess {
  users?: boolean;
  useradd?: boolean;
  organizations?: boolean;
  organizationadd?: boolean;
  organizationedit?: boolean;
  resources?: boolean;
  prizes?: boolean;
  prizeadd?: boolean;
  prizeedit?: boolean;
  notifications?: boolean;
  notificationadd?: boolean;
  notificationview?: boolean;
  internshipadd?: boolean;
  internshipedit?: boolean;
  opportunityadd?: boolean;
  opportunityedit?: boolean;
  scholarshipadd?: boolean;
  scholarshipedit?: boolean;
  scholarshipapplicants?: boolean;
  scholarshipapplication?: boolean;
  applicants?: boolean;
  messageboard?: boolean;
  approvals?: boolean;
  keycards?: boolean;
}