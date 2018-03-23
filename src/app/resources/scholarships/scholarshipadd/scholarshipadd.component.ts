import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { error } from 'util';
import { MultiSelectService, ResourcesService, CurrentUserService, AuthService } from '../../../app.services-list';
import { Model } from '../../../app.models-list';
import { MultiSelectUtil } from '../../../_utils/multiselect.util';
import { FormsModule } from '@angular/forms';
import { NavbarService } from '../../../app.services-list';
import { GlobalState } from '../../../global.state';
// import { userInfo } from 'os';
import { User } from '../../../_models/user.model';

@Component({
  selector: 'app-scholarshipadd',
  templateUrl: './scholarshipadd.component.html',
  styleUrls: ['./scholarshipadd.component.scss']
})
export class ScholarshipAddComponent implements OnInit {
  public scholarship: Model.Scholarship;
  public originalScholarship: Model.Scholarship;
  public careers: Array<Model.Career>;
  public schools: Array<Model.Organization>;
  public organizations: Array<Model.Organization>;
  public ktsSelectSettings: any = {};
  public ktsMultiSettings: any = {};
  public selectedEthnicities = [];
  public careerList = [];
  public selectedCareers = [];
  public schoolList = [];
  public selectedSchools = [];
  public organizationList = [];
  public selectedOrganization = [];
  public title: string;
  public editFlag: boolean;
  public disableFlag: boolean;
  public creating = false;
  public scholarshipId: string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private multiSelectService: MultiSelectService,
    private resourcesService: ResourcesService,
    private navBarService: NavbarService,
    public global: GlobalState,
    private currentUserService: CurrentUserService,
    public authProvider: AuthService,
  ) {
  }
  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('resources'); 
    this.scholarship = new Model.Scholarship({});
    this.originalScholarship = new Model.Scholarship({});
    this.schools = new Array<Model.Organization>();
    this.organizations = new Array<Model.Organization>(null);
    this.title = 'New Scholarship';

    this.scholarshipId = this.route.snapshot.paramMap.get('scholarshipId');
    if (this.scholarshipId !== null) {
      this.title = 'Edit Scholarship';
      this.editFlag = true;
      this.disableFlag = true;

      this.getScholarship(this.scholarshipId);
    }

    this.getUser();
    this.getCareers();
    this.getSchools();
    this.getOrganizations();

    this.ktsMultiSettings = MultiSelectUtil.multiSettings;
  }

  getUser() {
    this.currentUserService.getCurrentUser(this.authProvider).then((res: Model.User) => {
      if (res) {
        this.setAdminStatus(res.roles);
        const org = res.organization;
        if (!this.scholarshipId) {
          this.selectedOrganization.push(new MultiSelectUtil.SelectItem(org.name, this.scholarship.organization_id));
        }
      }
    }, err => {
      console.log('err', err);
    });
  }

  setAdminStatus(roles: Array<string>): void {
    const filtered = roles.filter(role => {
      if (role === 'admin') { return true; }
    });
    this.ktsSelectSettings = MultiSelectUtil.singleSelection;
    this.ktsSelectSettings.disabled = filtered.length > 0 ? false : true;
  }

  onSchoolSelect(item: any) {
    this.onChange(item);
  }

  onSchoolDeSelect(item: any) {
    this.onChange(item);
  }

  getSchools(): void {
    this.multiSelectService.getDropdownSchools().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.schoolList = res;
    }, err => {
      console.log('err', err);
    });
  }

  onCareerSelect(item: any) {
    this.onChange(item);
  }

  onCareerDeSelect(item: any) {
    this.onChange(item);
  }

  getCareers(): void {
    this.multiSelectService.getDropdownCareers().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.careerList = res;
    }, err => {
      console.log('err', err);
    });
  }

  onOrganizationSelect(item: any) {
    this.scholarship.organization_id = item.id;
    this.onChange(item);
  }

  onOrganizationDeSelect(item: any) {
    this.scholarship.organization_id = null;
    this.onChange(item);
  }

  getOrganizations(): void {
    this.multiSelectService.getDropdownOrganizations().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.organizationList = res;
    }, err => {
      console.log('err', err);
    });
  }

  getScholarship(id: string): void {
    this.creating = true;
    this.resourcesService.getScholarship(id).subscribe((res) => {
      this.scholarship = res;
      this.originalScholarship = Object.assign({}, res);
      this.selectedSchools = this.scholarship.schools.map(school => new MultiSelectUtil.SelectItem(school.name, school.id));
      this.selectedCareers = this.scholarship.careers.map(career => new MultiSelectUtil.SelectItem(career.title, career.id));
      if (this.scholarship.organization) {
        this.selectedOrganization.push(new MultiSelectUtil.SelectItem(this.scholarship.organization.name,
          this.scholarship.organization_id));
      }
      this.creating = false;
    }, (errors) => {
      this.creating = false;
      console.log('err', errors);
      alert('Server error');
    });
  }

  onChange(event): void {
    if (this.editFlag) {
      if (this.scholarship.title !== this.originalScholarship.title) {
        this.disableFlag = false;
        return;
      }

      if (this.scholarship.description !== this.originalScholarship.description) {
        this.disableFlag = false;
        return;
      }

      if (this.scholarship.organization_id !== this.originalScholarship.organization_id) {
        this.disableFlag = false;
        return;
      }

      if (this.scholarship.url !== this.originalScholarship.url) {
        this.disableFlag = false;
        return;
      }

      if (this.scholarship.amount !== this.originalScholarship.amount) {
        this.disableFlag = false;
        return;
      }

      if (this.scholarship.number_available !== this.originalScholarship.number_available) {
        this.disableFlag = false;
        return;
      }

      if (this.scholarship.active !== this.originalScholarship.active) {
        this.disableFlag = false;
        return;
      }

      if (this.scholarship.in_app !== this.originalScholarship.in_app) {
        this.disableFlag = false;
        return;
      }

      if (!this.isCareersChanged()) {
        this.disableFlag = false;
        return;
      }

      if (!this.isSchoolChanged()) {
        this.disableFlag = false;
        return;
      }

      this.disableFlag = true;
    }
  }

  isCareersChanged(): boolean {
    // TODO: Update once lodash is added
    return this.selectedCareers.length > 0 ? false : true;
  }

  isSchoolChanged(): boolean {
    // TODO: Update once lodash is added
    return this.selectedSchools.length > 0 ? false : true;
  }

  saveScholarship(valid: boolean): void {

    if (!valid) {
      return;
    }

    if (!this.validURL(this.scholarship.url)) {
      return;
    }

    if (this.selectedOrganization.length === 0) {
      return;
    }

    if (!this.scholarship.active) {
      this.scholarship.active = false;
    }

    if (!this.scholarship.in_app) {
      this.scholarship.in_app = false;
    }

    this.scholarship.type = 'Scholarship';

    this.scholarship.career_ids = this.selectedCareers.map(career => {
      return career.id;
    });

    this.scholarship.school_ids = this.selectedSchools.map(school => {
      return school.id;
    });

    this.creating = true;
    if (!this.scholarship.id) {
      this.resourcesService.createScholarship(this.scholarship).subscribe((res) => {
        this.creating = false;
        alert('Create new scholarship successfully');
        this.global.selectedTab = 'scholarships';
        this.router.navigate(['resources']);
        this.scholarship = res;
      }, (errors) => {
        this.creating = false;
        alert('Server error');
      });
    } else {
      this.resourcesService.updateScholarship(this.scholarship).subscribe((res) => {
        this.creating = false;
        alert('Update scholarship successfully');
        this.global.selectedTab = 'scholarships';
        this.router.navigate(['resources']);
      }, (errors) => {
        this.creating = false;
        alert('Server error');
      });
    }
  }

  goBack(): void {
    this.router.navigate(['resources']);
  }

  gotoApplicants(id): void {
    this.router.navigate(['scholarshipapplicants/' + id]);
  }

  deleteScholarship(): void {
  }

  validURL(url: string) {
    // tslint:disable-next-line:max-line-length
    const pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return pattern.test(url);
  }
}
