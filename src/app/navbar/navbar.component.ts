import { Component, OnInit } from '@angular/core';
import { NavbarService, CurrentUserService, AuthService, AccessService } from '../app.services-list';
import { Model } from '../app.models-list';
import * as Services from '../app.services-list';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public tab: string;
  public active: boolean;

  public subscription: Subscription;
  public subUserScription: Subscription;
  public canViewUsers: boolean;
  public canViewOrganizations: boolean;
  public canViewResources: boolean;
  public canViewAwardedPrizes: boolean;
  public canViewNotifications: boolean;
  public canViewSchedule: boolean;
  public canViewApprovals: boolean;
  public loading = false;

  constructor(
    public navBarService: NavbarService,
    private authService: Services.AuthService,
    private currentUserService: CurrentUserService,
    private authProvider: AuthService,
    public access: AccessService
  ) { }

  ngOnInit() {
    this.subscription = this.navBarService.tabEvent.subscribe(event => this.switchTab(event));
    this.subUserScription = this.currentUserService.currentUserEvent.subscribe(event => this.changeNavState(event));
    this.getUser();
  }

  getUser() {
    this.currentUserService.getCurrentUser(this.authProvider, false).then((user: Model.User) => {
      this.changeNavState(user);
    });
  }

  changeNavState(user: Model.User): void {
    if (user) {
      this.canViewUsers = this.access.getAccess(user.getRole()).functionalityAccess.usersTab;
      this.canViewOrganizations = this.access.getAccess(user.getRole()).functionalityAccess.organizationTab;
      this.canViewResources = this.access.getAccess(user.getRole()).functionalityAccess.resourcesTab;
      this.canViewAwardedPrizes = this.access.getAccess(user.getRole()).functionalityAccess.prizesTab;
      this.canViewNotifications = this.access.getAccess(user.getRole()).functionalityAccess.notificationsTab;
      this.canViewSchedule = this.access.getAccess(user.getRole()).functionalityAccess.scheduleTab;
      this.canViewApprovals = this.access.getAccess(user.getRole()).functionalityAccess.approvalsTab;
    }
  }

  switchTab(tab: string): void {
    this.tab = tab;
    this.navBarService.activeTab = tab;
  }

  logout(event) {
    this.active = false;
    this.authService.logout();
  }

  detectClick(data) {
    // tslint:disable-next-line:curly
    if (this.active === true && data === true)
      data = false;
    this.active = data;
  }
}

