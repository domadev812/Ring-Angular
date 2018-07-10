import 'rxjs/add/observable/throw';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MultiSelectService, ResourcesService, CurrentUserService, AuthService, AccessService } from '../../../app.services-list';
import { Model } from '../../../app.models-list';
import { GlobalState } from '../../../global.state';
import { MultiSelectUtil } from '../../../_utils/multiselect.util';
import { NavbarService } from '../../../app.services-list';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../_models/user.model';

@Component({
  selector: 'app-internshipadd',
  templateUrl: './internshipadd.component.html',
  styleUrls: ['./internshipadd.component.scss']
})
export class InternshipAddComponent implements OnInit {
  public internship: Model.Resource;
  public careers: Array<Model.Career>;
  public organizations: Array<Model.Organization>;
  public schools: Array<Model.Organization>;
  public internshipId: string;
  public title;

  public organizationSelectSettings: MultiSelectUtil.ISelectSettings;
  public careerMultiSettings: MultiSelectUtil.ISelectSettings;
  public schoolMultiSettings: MultiSelectUtil.ISelectSettings;
  public careerList: Observable<MultiSelectUtil.SelectItem[]>;
  public selectedCareers = [];
  public schoolList = [];
  public selectedSchools = [];
  public organizationList: Observable<MultiSelectUtil.SelectItem[]>;
  public selectedOrganization = [];

  public pageSate: 'edit' | 'approval' | 'readonly' | 'new' = 'edit';
  public canApprove = false;
  public isLoading = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private resourcesService: ResourcesService,
    private multiSelectService: MultiSelectService,
    public global: GlobalState,
    public navBarService: NavbarService,
    private currentUserService: CurrentUserService,
    private authProvider: AuthService,
    public access: AccessService,
  ) {
    this.careerList = this.multiSelectService.getDropdownCareerGroups();
    this.organizationList = this.multiSelectService.getDropdownOrganizations();
  }

  async ngOnInit(): Promise<void> {
    try {
      this.internshipId = this.route.snapshot.paramMap.get('internshipId');
      this.navBarService.show();
      this.navBarService.activeTabChanged('resources');
      this.internship = new Model.Resource({});
      this.schools = new Array<Model.Organization>();
      this.organizations = new Array<Model.Organization>(null);
      await this.getSchools();
      this.setState();
    } catch (err) {
      alert(err.message ? err.message : 'Server Error');
    }
  }

  setTitle() {
    if (this.approval()) this.title = 'Awaiting Approval';
    else if (!this.internshipId) this.title = 'New Internship';
    else this.title = 'Edit Internship';
  }

  async getSchools(): Promise<void> {
    this.schoolList = await this.multiSelectService.getDropdownSchools().toPromise();
  }

  // dropdowns should follow disabled for the rest of page except for the following case:
  //    A user is not an admin, which then the multiselects for organizations/schools are disabled regardless and prefilled  
  setMultiSelect(currentUser: User): void {
    const isAdmin = currentUser.roles.includes('admin');
    const selectSettings: MultiSelectUtil.ISelectSettings = { disabled: this.disabled() };
    if (!currentUser.isAdmin()) selectSettings.disabled = true;
    this.organizationSelectSettings = MultiSelectUtil.singleSelection(selectSettings);
    this.schoolMultiSettings = MultiSelectUtil.selectAllMultiSettings(selectSettings);
    this.careerMultiSettings = MultiSelectUtil.multiSettings({ disabled: this.disabled() });
  }

  async setState(): Promise<void> {
    const currentUser = await this.currentUserService.getCurrentUser(this.authProvider);
    this.canApprove = this.access.getAccess(currentUser.getRole()).functionalityAccess.approveRejectButtons;
    if (this.internshipId) await this.getResource(this.internshipId);
    else {
      this.selectedOrganization.push(
        new MultiSelectUtil.SelectItem(currentUser.organization.name, currentUser.organization_id)
      );
      const filteredSchools = MultiSelectUtil.isListed(this.schoolList, currentUser);
      if (filteredSchools)
        this.selectedSchools.push(
          new MultiSelectUtil.SelectItem(currentUser.organization.name, currentUser.organization_id)
        );
      this.internship.organization_id = currentUser.organization_id;
    }
    this.pageSate = this.internship.getPageState(currentUser);
    this.setTitle();
    this.setMultiSelect(currentUser);
  }

  disabled(): boolean {
    return this.pageSate !== 'new' && (this.pageSate === 'readonly' || this.pageSate === 'approval');
  }

  approval(): boolean {
    return this.pageSate === 'approval';
  }

  readonly(): boolean {
    return this.pageSate === 'readonly';
  }

  async getResource(id: string): Promise<void> {
    try {
      this.isLoading = true;
      this.internship = await this.resourcesService.getResource(id).toPromise();
      this.selectedSchools = this.internship.schools.map(school => new MultiSelectUtil.SelectItem(school.name, school.id));
      this.selectedCareers = this.internship.career_groups.map(career => new MultiSelectUtil.SelectItem(career.title, career.id));
      if (this.internship.organization) {
        this.selectedOrganization.push(new MultiSelectUtil.SelectItem(this.internship.organization.name,
          this.internship.organization_id));
      }
    } catch (err) {
      alert(err.message ? err.message : 'Server Error');
    }
    this.isLoading = false;
  }

  saveInternship(valid: boolean): void {

    if (!valid) return;

    this.internship.buildResourceFromForm(this.selectedCareers, this.selectedSchools, 'Internship');
    if (!this.internship.id) {
      this.resourcesService.createResource(this.internship).subscribe((res) => {
        alert('Created new internship successfully');
        this.global.selectedTab = 'opportunities';
        this.router.navigate(['resources']);
      }, (errors) => {
        alert('Server error');
      });
    } else {
      this.resourcesService.updateResource(this.internship).subscribe((res) => {
        alert('Updated internship successfully');
        this.global.selectedTab = 'internships';
        this.router.navigate(['resources']);
      }, (errors) => {
        alert('Server error');
      });
    }
  }

  isValid(): boolean {
    return this.validURL(this.internship.url) && this.selectedOrganization.length > 0;
  }

  approve(): void {
    this.resourcesService.internshipApprove(this.internshipId).subscribe((res) => {
      alert('internship Approved');
      this.router.navigate(['approvals']);
    }, err => {
      alert(err);
    });
  }

  reject(): void {
    this.resourcesService.internshipReject(this.internshipId).subscribe((res) => {
      alert('internship Rejected');
      this.router.navigate(['approvals']);
    }, err => {
      alert(err);
    });
  }

  goBack(): void {
    this.router.navigate(['resources']);
  }

  gotoApplicants(id): void {
    this.router.navigate(['applicants/' + id]);
  }

  validURL(url: string) {
    // tslint:disable-next-line:max-line-length
    const pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return pattern.test(url);
  }

  tooltip(type: string): string {
    if (type === 'In App') {
      return 'In App scholarships are sent to the student’s scholarship counselor for selection.' +
        ' Please contact Keys to Success before you select this.';
    } else if (type === 'Active') {
      return 'Select this for your scholarship, internship, or internship to be active for students to see.';
    }
  }
}
