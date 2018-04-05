import { Component, OnInit } from '@angular/core';
import { Router, Routes, RouterModule } from '@angular/router';
import { GlobalState } from '../global.state';
import { NavbarService, CurrentUserService, AuthService, AccessService } from '../app.services-list';
import { Model } from '../app.models-list';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss']
})

export class ResourcesComponent implements OnInit {

  selectedTab: String = '';
  userRole: boolean;
  canViewScholarships: boolean;
  canViewInternships: boolean;
  canviewOtherOpportunities: boolean;
  canCreateScholarships: boolean;
  canCreateInternships: boolean;
  canCreateOpportunities: boolean;

  constructor(
    private router: Router,
    public global: GlobalState,
    private navBarService: NavbarService,
    private currentUserService: CurrentUserService,
    private authProvider: AuthService,
    public access: AccessService
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('resources');    
    if (this.global.selectedTab === '') {
      this.selectedTab = 'scholarships';
    } else {
      this.selectedTab = this.global.selectedTab;
    }
    this.global.selectedTab = '';
    this.getUser();
  }

  getUser() {
    this.currentUserService.getCurrentUser(this.authProvider).then((user: Model.User) => {
      if (user) {
        this.canViewScholarships = this.access.getAccess(user.getRole()).functionalityAccess.scholarshipsTab;
        this.canViewInternships = this.access.getAccess(user.getRole()).functionalityAccess.internshipsTab;
        this.canviewOtherOpportunities = this.access.getAccess(user.getRole()).functionalityAccess.otherOpportunitiesTab;
        this.canCreateInternships = this.access.getAccess(user.getRole()).functionalityAccess.newInternshipButton;
        this.canCreateOpportunities = this.access.getAccess(user.getRole()).functionalityAccess.newOpportunityButton;
        this.canCreateScholarships = this.access.getAccess(user.getRole()).functionalityAccess.newScholarshipButton;
      }
    });
  }


  addNewResource(pathName): void {
    this.router.navigate([pathName]);
  }

  addNewScholarship(): void {
    this.router.navigate(['scholarshipadd']);
  }

  switchTab(selectedTab: String): void {
    this.selectedTab = selectedTab;
  }

  mouseWheelUp(): void {
    let scrollArea = document.getElementsByClassName('table-content-with-search');
    scrollArea[0].scrollTop = scrollArea[0].scrollTop - 40;
  }
  mouseWheelDown(): void {
    let scrollArea = document.getElementsByClassName('table-content-with-search');
    scrollArea[0].scrollTop = scrollArea[0].scrollTop + 40;
  }

}
