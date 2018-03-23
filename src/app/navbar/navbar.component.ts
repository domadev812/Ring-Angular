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

  tab: string;
  active: boolean;

  public subscription: Subscription;
  canViewUsers: boolean;
  canViewOrganizations: boolean;
  canViewResources: boolean;
  canViewAwardedPrizes: boolean;
  canViewNotifications: boolean;
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
    this.getUser();

  }

  getUser() {
    this.currentUserService.getCurrentUser(this.authProvider, false).then((user: Model.User) => {
      if (user) {
        this.canViewUsers = this.access.getRoleAccess(user.getRole()).functionalityAccess.usersTab;
        this.canViewOrganizations = this.access.getRoleAccess(user.getRole()).functionalityAccess.organizationTab;
        this.canViewResources = this.access.getRoleAccess(user.getRole()).functionalityAccess.resourcesTab;
        this.canViewAwardedPrizes = this.access.getRoleAccess(user.getRole()).functionalityAccess.prizesTab;
        this.canViewNotifications = this.access.getRoleAccess(user.getRole()).functionalityAccess.notificationsTab;

      }
    });
  }

  switchTab(tab: string): void {
    this.tab = tab;
    this.navBarService.activeTab = tab;
  }

  logout(event) {
    this.authService.logout();
  }

}
