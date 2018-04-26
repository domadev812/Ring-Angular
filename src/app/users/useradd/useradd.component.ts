import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { error } from 'util';
import { MultiSelectService, UsersService, NavbarService, AuthService, CurrentUserService } from '../../app.services-list';
import { Model } from '../../app.models-list';
import { MultiSelectUtil } from '../../_utils/multiselect.util';
import { GlobalState } from '../../global.state';

@Component({
  selector: 'app-useradd',
  templateUrl: './useradd.component.html',
  styleUrls: ['./useradd.component.scss']
})

export class UserAddComponent implements OnInit {
  currentUser: Model.User;
  user: Model.User;
  originalUser: Model.User;
  title: string;
  organizationTitle: string;
  editFlag: boolean;
  disableFlag: boolean;
  schoolList = [];
  sponsorList = [];
  organizationList = [];
  selectedOrganization = [];
  typeList = [{ itemName: 'Student', id: 'student' },
              { itemName: 'Key Contact', id: 'key_contact' },
              { itemName: 'Counselor', id: 'counselor' },
              { itemName: 'Community', id: 'communities' }];
  filteredTypeList = [];
  selectedType = [];
  ktsTypeSettings = {};
  ktsOrganizationSettings = {};
  creating = false;
  adminFlag = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public usersService: UsersService,
    public multiSelectService: MultiSelectService,
    public global: GlobalState,
    public navBarService: NavbarService,
    public authProvider: AuthService,
    public currentUserService: CurrentUserService,
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('users');
    this.title = 'New User';
    this.organizationTitle = 'School';
    this.user = new Model.User({});
    this.originalUser = new Model.User({});
    this.editFlag = false;
    this.disableFlag = false;
    this.ktsTypeSettings = Object.assign({}, MultiSelectUtil.singleSelection);
    this.ktsOrganizationSettings = Object.assign({}, MultiSelectUtil.singleSelection);

    const id = this.route.snapshot.paramMap.get('userId');
    this.getCurrentUser();
    if (id !== null) {
      this.title = 'User Details';
      this.editFlag = true;
      this.ktsTypeSettings['disabled'] = true;
      this.ktsOrganizationSettings['disabled'] = true;
      this.getUser(id);
    }
    this.getSchools();
    this.getSponsors();
  }

  onSchoolSelect(item: any) {
    this.user.organization_id = item.id;
    this.onChange(item);
  }

  onSchoolDeSelect(item: any) {
    this.onChange(item);
  }

  onTypeSelect(item: any) {
    this.user.type = item.id;
    this.changeOrganizationList();
    this.onChange(item);
    this.global.selectedTab = item.id;
  }

  onTypeDeSelect(item: any) {
    this.changeOrganizationList();
    this.onChange(item);
  }

  goBack(event): void {
    this.router.navigate(['users']);
  }

  getCurrentUser(): void {
    this.currentUserService.getCurrentUser(this.authProvider).then((res: Model.User) => {
      this.currentUser = res;
      let roles = this.currentUser.roles.map(role => role);
      this.ktsTypeSettings = Object.assign({}, MultiSelectUtil.singleSelection);
      this.ktsOrganizationSettings = Object.assign({}, MultiSelectUtil.singleSelection);
      if (roles.indexOf('admin') !== -1) {
        this.filteredTypeList = this.typeList.map(type => type);
        this.adminFlag = true;
      } else if (roles.indexOf('key_contact') !== -1) {
        this.filteredTypeList = this.typeList.filter(type => type.id === 'counselor' || type.id === 'student');
        this.selectedOrganization.push({ id: this.currentUser.organization_id, itemName: this.currentUser.organization.name });
        this.ktsOrganizationSettings['disabled'] = true;
      } else if (roles.indexOf('counselor') !== -1) {
        this.filteredTypeList = this.typeList.filter(type => type.id === 'student');
        this.selectedOrganization.push({ id: this.currentUser.organization_id, itemName: this.currentUser.organization.name });
        this.selectedType.push(this.filteredTypeList[0]);
        this.ktsTypeSettings['disabled'] = true;
        this.ktsOrganizationSettings['disabled'] = true;
      } else if (roles.indexOf('communities') !== -1) {
        this.filteredTypeList = this.typeList.map(type => type);
      }
    });
  }

  getUser(id): void {
    this.creating = true;
    this.usersService.getUser(id).subscribe((res) => {
      this.user = res;
      this.originalUser = Object.assign({}, this.user);
      let userRole = this.getUserRole();

      if (userRole) {
        this.setUpUserDefaults(userRole);
      }

      if (this.organizationList.length > 0) {
        this.selectOrganizations();
      }

      this.disableFlag = true;
      this.creating = false;
    }, (errors) => {
      this.creating = false;
      alert('Server error');
    });
  }

  getUserRole(): any {
    return this.typeList.find(type => {
      let role = this.user.roles.find(roleItem => roleItem === type.id);
      return role ? true : false;
    });
  }

  setUpUserDefaults(userRole): void {
    this.selectedType.push(userRole);
    this.changeOrganizationList();
    this.title = userRole.itemName + ' Details';
    this.global.selectedTab = userRole.id;
  }

  selectOrganizations(): void {
    let org = this.organizationList.find(organization => organization.id === parseInt(this.user.organization_id, 0));
    if (org) {
      this.selectedOrganization.push(org);
    }
  }

  onChange(event): void {
    if (this.editFlag && this.user && this.originalUser) {
      if (this.user.first_name !== this.originalUser.first_name) {
        this.disableFlag = false;
        return;
      }
      if (this.user.last_name !== this.originalUser.last_name) {
        this.disableFlag = false;
        return;
      }
      if (this.user.points !== this.originalUser.points) {
        this.disableFlag = false;
        return;
      }
      this.disableFlag = true;

    } else {
      this.disableFlag = false;
    }
  }

  saveUser(formValid: boolean): void {
    if (!formValid) {
      return;
    }

    this.getMultiselectValues();

    if (!this.user.id) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  getMultiselectValues() {
    if (this.selectedOrganization.length === 0 || this.selectedType.length === 0) {
      return;
    }

    this.user.organization_id = this.selectedOrganization[0].id;

    if (!this.user.roles) {
      this.user.roles = [];
      this.user.roles.push(this.selectedType[0].id);
    } else {
      this.user.roles.push(this.selectedType[0].id);
    }
  }

  createUser() {
    this.creating = true;
    this.usersService.createUser(this.user).subscribe((res) => {
      this.creating = false;
      alert('User is created');
      this.router.navigate(['users']);
    }, (errors) => {
      this.creating = false;
      alert(errors.message);
    });
  }

  updateUser() {
    let updatedUser = Object.assign({}, this.user);
    delete updatedUser.password;
    this.creating = false;
    this.usersService.updateUser(updatedUser).subscribe((res) => {
      this.creating = false;
      alert('User is updated');
      this.router.navigate(['users']);
    }, (errors) => {
      this.creating = false;
      alert(errors.message);
    });
  }

  getSchools(): void {
    this.multiSelectService.getDropdownSchools().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.schoolList = res;
      if (this.editFlag && this.user.organization_id && this.schoolList.length > 0) {
        let org = this.schoolList.find(organization => organization.id === parseInt(this.user.organization_id, 0));
        if (org) {
          this.selectedOrganization.push(org);
        }
      }
      this.changeOrganizationList();
    }, err => {
      console.log('err', err);
    });
  }

  getSponsors(): void {
    this.multiSelectService.getDropdownSponsors().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.sponsorList = res;
      if (this.editFlag && this.user.organization_id && this.sponsorList.length > 0) {
        let org = this.sponsorList.find(organization => organization.id === parseInt(this.user.organization_id, 0));
        if (org) {
          this.selectedOrganization.push(org);
        }
      }
      this.changeOrganizationList();
    }, err => {
      console.log('err', err);
    });
  }

  changeOrganizationList(): void {
    if (this.selectedType.length > 0 && this.selectedType[0].id === 'communities') {
      this.organizationTitle = 'Organization';
      this.organizationList = this.sponsorList.map(sponsor => sponsor);
    } else {
      this.organizationTitle = 'School';
      this.organizationList = this.schoolList.map(school => school);
    }
  }

  validEmail(email: string): boolean {
    // tslint:disable-next-line:max-line-length
    const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
  }
}
