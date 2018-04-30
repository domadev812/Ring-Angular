import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { error } from 'util';
import { MultiSelectService, ResourcesService, CurrentUserService, AuthService, AccessService } from '../../../app.services-list';
import { Model } from '../../../app.models-list';
import { GlobalState } from '../../../global.state';
import { MultiSelectUtil } from '../../../_utils/multiselect.util';
import { NavbarService } from '../../../app.services-list';

@Component({
  selector: 'app-internshipadd',
  templateUrl: './internshipadd.component.html',
  styleUrls: ['./internshipadd.component.scss']
})
export class InternshipAddComponent implements OnInit {
  public internship: Model.Resource;
  public originalInternship: Model.Resource;
  public careers: Array<Model.Career>;
  public career_ids: Array<Model.Career>;
  public organizationList = [];
  public selectedOrganization = [];
  public ktsSelectSettings: any = {};
  public ktsMultiSettings: any = {};
  public careerList = [];   //Selectable Career List
  public selectedCareers = [];    //Selected Career List
  public title: string;
  public editFlag: boolean;
  public disableFlag: boolean;
  public opportunity = [];
  public currentCareers = [];
  public creating = false;
  public internshipId: string;
  public approved: boolean;
  public approveBtn: boolean;
  public saveBtn: boolean;
  public currentRoute: string;
  public currentUser: any;
  public canViewApproveReject: boolean;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private resourcesService: ResourcesService,
    private multiSelectService: MultiSelectService,
    public global: GlobalState,
    public navBarService: NavbarService,
    private currentUserService: CurrentUserService,
    private authProvider: AuthService,
    public access: AccessService,

  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.internshipId = this.route.snapshot.paramMap.get('internshipId');
      this.navBarService.show();
      this.navBarService.activeTabChanged('resources');
      this.internship = new Model.Resource({});
      this.originalInternship = new Model.Resource({});
      this.careers = new Array<Model.Career>();
      this.career_ids = new Array<Model.Career>();
      this.editFlag = false;
      this.disableFlag = false;
      this.approved = true;
      this.currentRoute = this.route.snapshot.url[0].path;
      this.currentUser = await this.currentUserService.getCurrentUser(this.authProvider);
      this.setUpForView(this.currentUser.roles);
      this.getCareers();
      this.getOrganizations();
    } catch (err) { }
  }

  setMsSettings(sDisabled: boolean = null, mDisabled: boolean = null): void {
    this.ktsSelectSettings.disabled = sDisabled;
    this.ktsMultiSettings.disabled = mDisabled;
  }

  setTitle(title: string = null) {
    if (title) {
      this.title = title;
    } else if (!this.approved) {
      this.title = this.internship.organization.name;
    } else if (this.internshipId !== null) {
      this.title = 'Edit Internship';
    }
  }

  showButtonGroup() {
    if (this.internshipId === null) {
      this.approveBtn = true;
    }
    if (!this.approved) {
      this.approveBtn = false;
      this.saveBtn = true;
    } else {
      this.approveBtn = true;
    }
  }

  setMultiSelect() {
    this.ktsSelectSettings = MultiSelectUtil.singleSelection;
    this.ktsSelectSettings.disabled = !this.approved;
    this.ktsMultiSettings = MultiSelectUtil.multiSettings;
    this.ktsMultiSettings.disabled = !this.approved;
  }

  multiSelectPreFlight(): void {
    const isAdmin = this.currentUser.roles.includes('admin');
    this.ktsSelectSettings = MultiSelectUtil.singleSelection;
    this.ktsMultiSettings = MultiSelectUtil.multiSettings;

    if (isAdmin && this.internshipId && !this.approved) {
      this.setMsSettings(true, true);
      this.selectedOrganization.push(new MultiSelectUtil.SelectItem(this.currentUser.organization.name, this.internship.organization_id));
    } else if (isAdmin && !this.internshipId) {
      this.setMsSettings(false, false);
    } else if (isAdmin && this.internshipId && this.approved) {
      this.setMsSettings(false, false);
    } else if (!isAdmin && !this.internshipId) {
      this.setMsSettings(true, false);
      this.selectedOrganization.push(new MultiSelectUtil.SelectItem(this.currentUser.organization.name, this.internship.organization_id));
    }
  }


  setUpForView(roles: Array<string>): void {
    this.canViewApproveReject = this.access.getAccess(this.currentUser.getRole()).functionalityAccess.approveRejectButtons;
    const userType = roles.includes('admin') ? 'admin' : 'other';
    const selector = `${userType + '_' + this.currentRoute}`;
    const setupIndex = {
      'admin_internshipedit': this.admininternshipEdit.bind(this),
      'admin_internshipadd': this.admininternshipAdd.bind(this),
      'other_internshipadd': this.userinternshipAdd.bind(this),
      'other_internshipedit': this.userinternshipEdit.bind(this),

    };
    return setupIndex[selector]();
  }

  admininternshipEdit(): void {
    if (this.internshipId) this.getResource(this.internshipId);
    if (this.approved) this.showButtonGroup();
    this.approveBtn = false;

  }
  userinternshipEdit(): void {
    if (this.internshipId) this.getResource(this.internshipId);

  }

  admininternshipAdd(): void {
    if (!this.internshipId)
      this.multiSelectPreFlight();
    this.setTitle('New internship');
    this.showButtonGroup();
  }

  userinternshipAdd(): void {
    if (!this.internshipId)
      this.multiSelectPreFlight();
    this.setTitle('New internship');
    this.showButtonGroup();
  }

  onCareerSelect(item: any) {
    this.onChange(item);
  }
  onCareerDeSelect(item: any) {
    this.onChange(item);
  }

  onOrganizationSelect(item: any) {
    this.internship.organization_id = item.id;
    this.onChange(item);
  }
  onOrganizationDeSelect(item: any) {
    this.onChange(item);
  }

  onChange(event): void {
    if (this.editFlag) {
      if (this.internship.title !== this.originalInternship.title) {
        this.disableFlag = false;
        return;
      }

      if (this.internship.details !== this.originalInternship.details) {
        this.disableFlag = false;
        return;
      }

      if (this.internship.link !== this.originalInternship.link) {
        this.disableFlag = false;
        return;
      }

      if (this.selectedOrganization.length === 0) {
        this.disableFlag = false;
        return;
      } else if (this.selectedOrganization[0].id !== this.originalInternship.organization_id) {
        this.disableFlag = false;
        return;
      }

      if (this.internship.is_active !== this.originalInternship.is_active) {
        this.disableFlag = false;
        return;
      }

      if (!this.isCareersSame()) {
        this.disableFlag = false;
        return;
      }

      this.disableFlag = true;
    } else {
      this.disableFlag = false;
    }
  }

  isCareersSame(): boolean {
    return this.selectedCareers.length > 0 ? false : true;
  }

  getResource(id: string): void {
    this.creating = true;
    this.resourcesService.getResource(id).subscribe((res) => {
      this.internship = res;
      this.approved = res.approved;
      this.setTitle();
      this.showButtonGroup();
      this.multiSelectPreFlight();
      const parsedCareers = res.careers.map(careers => {
        careers.title = careers.title;
        careers.id = careers.id;
        return careers;
      });
      this.selectedCareers = MultiSelectUtil.SelectItem.buildFromData(parsedCareers, 'Career');
      this.originalInternship = Object.assign({}, res);
      if (!this.originalInternship.is_active) {
        this.originalInternship.is_active = false;
      }
      if (this.organizationList.length > 0) {
        let org = this.organizationList.find(organization => organization.id === this.internship.organization_id);
        this.selectedOrganization.push(org);
      }
      this.creating = false;
    }, (errors) => {
      this.creating = false;
      alert('Server error');
    });
  }

  getCareers(): void {
    this.multiSelectService.getDropdownCareers().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.careerList = res;
    }, err => {
      console.log('err', err);
    });
  }

  getOrganizations(): void {
    this.multiSelectService.getDropdownOrganizations().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.organizationList = res;
    }, err => {
      console.log('err', err);
    });
  }

  saveInternship(valid: boolean): void {
    if (!valid) {
      return;
    }

    if (!this.validURL(this.internship.link)) {
      return;
    }

    if (this.selectedOrganization.length === 0) {
      return;
    }

    if (!this.internship.is_active) {
      this.internship.is_active = false;
    }

    this.internship.type = 'Internship';

    this.internship.career_ids = this.selectedCareers.map((career) => {
      return career.id;
    });

    this.creating = true;
    if (!this.internship.id) {
      this.resourcesService.createResource(this.internship).subscribe((res) => {
        this.creating = false;
        alert('Create new internship successfully');
        this.global.selectedTab = 'internships';
        this.router.navigate(['resources']);
      }, (errors) => {
        this.creating = false;
        alert('Server error');
      });
    } else {
      this.resourcesService.updateResource(this.internship).subscribe((res) => {
        this.creating = false;
        alert('Update internship successfully');
        this.global.selectedTab = 'internships';
        this.router.navigate(['resources']);
      }, (errors) => {
        this.creating = false;
        alert('Server error');
      });
    }
  }

  approve(): void {
    this.resourcesService.opportunityApprove(this.internshipId).subscribe((res) => {
      alert('Internship Approved');
      this.router.navigate(['approvals']);
    }, err => {
      alert(err);
    });
  }

  reject(): void {
    this.resourcesService.opportunityReject(this.internshipId).subscribe((res) => {
      alert('Internship Rejected');
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

  deleteInternship(): void {

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
      return 'Select this for your scholarship, internship, or opportunity to be active for students to see.';
    }
  }
  
}
