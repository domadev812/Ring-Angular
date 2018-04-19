import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard';

import * as Components from './app.components-list';
import { UsersComponent } from './users/users.component';
import { UserAddComponent } from './users/useradd/useradd.component';
import { PrizesComponent } from './prizes/prizes.component';
import { ResourcesComponent } from './resources/resources.component';
import { AppliedUserComponent } from './resources/appliedusers/appliedusers.component';
import { InternshipAddComponent } from './resources/internships/internshipadd/internshipadd.component';
import { OpportunityAddComponent } from './resources/opportunities/opportunityadd/opportunityadd.component';
import { ScholarshipAddComponent } from './resources/scholarships/scholarshipadd/scholarshipadd.component';
import { ScholarshipApplicantsComponent } from './resources/scholarships/applicants/scholarshipapplicants.component';
import { ScholarshipApplicationComponent } from './resources/scholarships/application/scholarshipapplication.component';
import { PrizeAddComponent } from './prizes/prizeadd/prizeadd.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationAddComponent } from './notifications/notificationadd/notificationadd.component';
import { MessageBoardComponent } from './notifications/messageboard/messageboard.component';
import { RoleGuard } from './_guards/role.guard';
import { OrganizationsComponent } from './organizations/organizations.component';
import { OrganizationAddComponent } from './organizations/organizationadd/organizationadd.component';
import { ApprovalsComponent } from './approvals/approvals.component';

const appRoutes: Routes = [
  { path: 'login', component: Components.LoginComponent },

  { path: 'users', component: UsersComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'useradd', component: UserAddComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'useredit/:userId', component: UserAddComponent, canActivate: [AuthGuard] },

  { path: 'prizes', component: PrizesComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'prizeadd', component: PrizeAddComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'prizeedit/:prizeId', component: PrizeAddComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'internshipadd', component: InternshipAddComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'internshipedit/:internshipId', component: InternshipAddComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'applicants/:resourceId', component: AppliedUserComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'opportunityadd', component: OpportunityAddComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'opportunityedit/:opportunityId', component: OpportunityAddComponent, canActivate: [AuthGuard] },

  { path: 'scholarshipadd', component: ScholarshipAddComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'scholarshipedit/:scholarshipId', component: ScholarshipAddComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'scholarshipapplicants/:scholarshipId', component: ScholarshipApplicantsComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'scholarshipapplication', component: ScholarshipApplicationComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'resources', component: ResourcesComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'notificationadd', component: NotificationAddComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'notificationview/:notificationId', component: NotificationAddComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'organizations', component: OrganizationsComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'organizationadd/:type', component: OrganizationAddComponent, canActivate: [AuthGuard] },

  { path: 'organizationedit/:id', component: OrganizationAddComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'messageboard', component: MessageBoardComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: 'approvals', component: ApprovalsComponent, canActivate: [AuthGuard, RoleGuard] },

  { path: '**', redirectTo: '/login' }
];

export const routing = RouterModule.forRoot(appRoutes, { useHash: true });

