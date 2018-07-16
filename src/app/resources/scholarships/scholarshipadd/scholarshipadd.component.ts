import 'rxjs/add/observable/throw';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  MultiSelectService,
  ResourcesService,
  CurrentUserService,
  AuthService,
  AccessService,
  ToastService
} from '../../../app.services-list';
import { Model } from '../../../app.models-list';
import { MultiSelectUtil } from '../../../_utils/multiselect.util';
import { NavbarService } from '../../../app.services-list';
import { GlobalState } from '../../../global.state';
import { User } from '../../../_models/user.model';
import { Observable } from 'rxjs/Observable';
import { NotificationsService } from 'angular2-notifications';
import { ScholarshipTypes } from '../../../_models/scholarship.model';


@Component({
  selector: 'app-scholarshipadd',
  templateUrl: './scholarshipadd.component.html',
  styleUrls: ['./scholarshipadd.component.scss']
})
export class ScholarshipAddComponent implements OnInit {
  public scholarship: Model.Scholarship;
  public tuitionWaiver: boolean;
  public careers: Array<Model.Career>;
  public schools: Array<Model.Organization>;
  public organizations: Array<Model.Organization>;
  public scholarshipId: string;
  public title;

  // TODO: look at what we can do to pull this out of the component
  public organizationSelectSettings: MultiSelectUtil.ISelectSettings;
  public careerMultiSettings: MultiSelectUtil.ISelectSettings;
  public schoolMultiSettings: MultiSelectUtil.ISelectSettings;
  public careerList: Observable<MultiSelectUtil.SelectItem[]>;
  public selectedCareers = [];
  public schoolList = [];
  public selectedSchools = [];
  public organizationList: Observable<MultiSelectUtil.SelectItem[]>;
  public selectedOrganization = [];

  public pageState: 'edit' | 'approval' | 'readonly' | 'new' = 'edit';
  public canApprove = false;
  public isLoading = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private multiSelectService: MultiSelectService,
    private resourcesService: ResourcesService,
    private navBarService: NavbarService,
    public global: GlobalState,
    private currentUserService: CurrentUserService,
    public authProvider: AuthService,
    public access: AccessService,
    private _service: NotificationsService,
    public toastService: ToastService
  ) {
    // TODO: fix async pipe
    this.careerList = this.multiSelectService.getDropdownCareerGroups();
    this.organizationList = this.multiSelectService.getDropdownOrganizations();
  }

  async ngOnInit(): Promise<void> {
    try {
      this.scholarshipId = this.route.snapshot.paramMap.get('scholarshipId');
      this.navBarService.show();
      this.navBarService.activeTabChanged('resources');
      this.scholarship = new Model.Scholarship({});
      this.schools = new Array<Model.Organization>();
      this.organizations = new Array<Model.Organization>(null);
      await this.getSchools();
      this.setState();
    } catch (err) {
      this.toastService.showError(err.message ? err.message : 'Server Error');
    }
  }

  setTitle() {
    if (this.approval()) this.title = 'Awaiting Approval';
    else if (!this.scholarshipId) this.title = 'New Scholarship';
    else this.title = 'Edit Scholarship';
  }

  async getSchools(): Promise<void> {
    this.schoolList = await this.multiSelectService.getDropdownSchools().toPromise();
  }

  // dropdowns should follow disabled for the rest of page except for the following case:
  //    A user is not an admin, which then the multiselects for organizations/schools are disabled regardless and prefilled  
  setMultiSelect(currentUser: User): void {
    const selectSettings: MultiSelectUtil.ISelectSettings = { disabled: this.disabled() };
    if (!this.access.getAccess(currentUser.getRole()).functionalityAccess.canUseHighSchoolMultiSelect)
      selectSettings.disabled = true;
    this.organizationSelectSettings = MultiSelectUtil.singleSelection(selectSettings);
    this.schoolMultiSettings = MultiSelectUtil.selectAllMultiSettings(selectSettings);
    this.careerMultiSettings = MultiSelectUtil.multiSettings({ disabled: this.disabled() });
  }


  async setState(): Promise<void> {
    const currentUser = await this.currentUserService.getCurrentUser(this.authProvider);
    this.canApprove = this.access.getAccess(currentUser.getRole()).functionalityAccess.approveRejectButtons;
    if (this.scholarshipId) await this.getScholarship(this.scholarshipId);
    else {
      this.selectedOrganization.push(
        new MultiSelectUtil.SelectItem(currentUser.organization.name, currentUser.organization_id)
      );
      const filteredSchools = MultiSelectUtil.isListed(this.schoolList, currentUser);
      if (filteredSchools)
        this.selectedSchools.push(
          new MultiSelectUtil.SelectItem(currentUser.organization.name, currentUser.organization_id)
        );
      this.scholarship.organization_id = currentUser.organization_id;
    }
    this.pageState = this.scholarship.getPageState(currentUser);
    this.setTitle();
    this.setMultiSelect(currentUser);
  }

  disabled(): boolean {
    return this.pageState !== 'new' && (this.pageState === 'readonly' || this.pageState === 'approval');
  }

  approval(): boolean {
    return this.pageState === 'approval';
  }

  readonly(): boolean {
    return this.pageState === 'readonly';
  }

  async getScholarship(id: string): Promise<void> {
    try {
      this.isLoading = true;
      this.scholarship = await this.resourcesService.getScholarship(id).toPromise();
      this.selectedSchools = this.scholarship.schools.map(school => new MultiSelectUtil.SelectItem(school.name, school.id));
      this.selectedCareers = this.scholarship.career_groups.map(career => new MultiSelectUtil.SelectItem(career.title, career.id));
      this.tuitionWaiver = ScholarshipTypes.tuition_waiver === this.scholarship.type;
      if (this.scholarship.organization) {
        this.selectedOrganization.push(new MultiSelectUtil.SelectItem(this.scholarship.organization.name,
          this.scholarship.organization_id));
      }
    } catch (err) {
      this.toastService.showError(err.message ? err.message : 'Server Error');
    }
    this.isLoading = false;
  }

  saveScholarship(valid: boolean): void {
    if (!valid || !this.isValid()) return;

    this.isLoading = true;
    this.scholarship.buildScholarshipFromForm(
      this.selectedCareers,
      this.selectedSchools,
      this.selectedOrganization,
      this.tuitionWaiver
    );
    if (!this.scholarship.id) {
      this.resourcesService.createScholarship(this.scholarship).subscribe((res) => {
        this.global.selectedTab = 'scholarships';
        this.isLoading = false;
        this.toastService.show('Create new scholarship successfully');
        this.router.navigate(['resources']);
        this.scholarship = res;
      }, (errors) => {
        this.isLoading = false;
        this.toastService.showError('Server error');
      });
    } else {
      this.resourcesService.updateScholarship(this.scholarship).subscribe((res) => {
        this.isLoading = false;
        this.toastService.show('Update scholarship successfully');
        this.global.selectedTab = 'scholarships';
        this.router.navigate(['resources']);
      }, (errors) => {
        this.isLoading = false;
        this.toastService.showError('Server error');
      });
    }
  }

  isValid(): boolean {
    return this.validURL(this.scholarship.url) && this.selectedOrganization.length > 0;
  }
  goBack(): void {
    this.router.navigate(['resources']);
  }

  approve(): void {
    this.resourcesService.scholarshipApprove(this.scholarshipId).subscribe((res) => {
      this.toastService.show('Scholarship Approved');
      this.router.navigate(['approvals']);
    }, err => {
      this.toastService.showError(err);
    });
  }

  reject(): void {
    this.resourcesService.scholarshipReject(this.scholarshipId).subscribe((res) => {
      this.toastService.show('Scholarship Rejected');
      this.router.navigate(['approvals']);
    }, err => {
      this.toastService.showError(err);
    });
  }

  gotoApplicants(id): void {
    this.router.navigate(['scholarshipapplicants/' + id]);
  }

  validURL(url: string) {
    // tslint:disable-next-line:max-line-length
    const pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[A-Za-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return pattern.test(url);
  }

  tooltip(type: string): string {
    if (type === 'In App') {
      return 'In App scholarships are sent to the student’s scholarship counselor for selection.' +
        ' Please contact Keys to Success before you select this.';
    } else if (type === 'Active') {
      return 'Select this for your scholarship, internship, or opportunity to be active for students to see.';
    } else {
      return `Check this box if this is not a scholarship, but a tuition free voucher.
        This will be shown when the student views the scholarship.`;
    }
  }
}
