import { Component, OnInit } from '@angular/core';
import { Router, Routes, RouterModule } from '@angular/router';
import { GlobalState } from '../global.state';
import { Model } from '../app.models-list';
import { CurrentUserService, AuthService, AccessService } from '../app.services-list';
import * as Services from '../app.services-list';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public selectedTab: String = '';
  public canViewKeyContacts: boolean;
  public canViewStudents: boolean;
  public canViewCounselors: boolean;
  public canViewBusinessOwners: boolean;
  public canCreateNewUser: boolean;

  constructor(
    private router: Router,
    private currentUserService: Services.CurrentUserService,
    private navBarService: Services.NavbarService,
    public global: GlobalState,
    private authProvider: AuthService,
    public access: AccessService,
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('users');
    if (this.global.selectedTab === '') {
      this.selectedTab = 'student';
    } else {
      this.selectedTab = this.global.selectedTab;
    }
    this.global.selectedTab = '';
    this.getUser();
  }

  getUser() {
    this.currentUserService.getCurrentUser(this.authProvider).then((user: Model.User) => {
      if (user) {
        this.canViewKeyContacts = this.access.getAccess(user.getRole()).functionalityAccess.keyContactsTab;
        this.canViewBusinessOwners = this.access.getAccess(user.getRole()).functionalityAccess.businessOwnersTab;
        this.canViewCounselors = this.access.getAccess(user.getRole()).functionalityAccess.counselorsTab;
        this.canViewStudents = this.access.getAccess(user.getRole()).functionalityAccess.studentsTab;
        this.canCreateNewUser = this.access.getAccess(user.getRole()).functionalityAccess.newUserButton;
      }
    }, err => {
      console.log('err', err);
    });
  }

  addNewUser(event): void {
    this.router.navigate(['useradd']);
  }

  switchTab(selectedTab: String): void {
    this.selectedTab = selectedTab;
  }
}
