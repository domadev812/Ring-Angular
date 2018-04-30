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
  selector: 'app-opportunityadd',
  templateUrl: './opportunityadd.component.html',
  styleUrls: ['./opportunityadd.component.scss']
})
export class OpportunityAddComponent implements OnInit {
  public opportunity: Model.Resource;
  public originalOpportunity: Model.Resource;
  public careers: Array<Model.Career>;
  public organizations: Array<Model.Organization>;
  public organizationList = [];
  public selectedOrganization = [];
  public ktsSelectSettings: any = {};
  public ktsMultiSettings: any = {};
  public careerList = [];   //Selectable Career List
  public selectedCareers = [];    //Selected Career List
  public title: string;
  public editFlag: boolean;
  public disableFlag: boolean;
  public isAdmin: boolean;
  public creating: boolean;
  public opportunityId: string;
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
      this.opportunityId = this.route.snapshot.paramMap.get('opportunityId');
      this.navBarService.show();
      this.navBarService.activeTabChanged('resources');
      this.opportunity = new Model.Resource({});
      this.originalOpportunity = new Model.Resource({});
      this.careers = new Array<Model.Career>();
      this.organizations = new Array<Model.Organization>();
      this.title = 'New Opportunity';
      this.editFlag = false;
      this.disableFlag = false;
      this.creating = false;
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
      this.title = this.opportunity.organization.name;
    } else if (this.opportunityId !== null) {
      this.title = 'Edit opportunity';
    }
  }

  showButtonGroup() {
    if (this.opportunityId === null) {
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

    if (isAdmin && this.opportunityId && !this.approved) {
      this.setMsSettings(true, true);
      this.selectedOrganization.push(new MultiSelectUtil.SelectItem(this.currentUser.organization.name, this.opportunity.organization_id));
    } else if (isAdmin && !this.opportunityId) {
      this.setMsSettings(false, false);
    } else if (isAdmin && this.opportunityId && this.approved) {
      this.setMsSettings(false, false);
    } else if (!isAdmin && !this.opportunityId) {
      this.setMsSettings(true, false);
      this.selectedOrganization.push(new MultiSelectUtil.SelectItem(this.currentUser.organization.name, this.opportunity.organization_id));
    }
  }



  setUpForView(roles: Array<string>): void {
    console.log('setupforview');
    this.canViewApproveReject = this.access.getAccess(this.currentUser.getRole()).functionalityAccess.approveRejectButtons;
    const userType = roles.includes('admin') ? 'admin' : 'other';
    const selector = `${userType + '_' + this.currentRoute}`;
    console.log(userType, this.currentRoute);
    const setupIndex = {
      'admin_opportunityedit': this.adminopportunityEdit.bind(this),
      'admin_opportunityadd': this.adminopportunityAdd.bind(this),
      'other_opportunityadd': this.useropportunityAdd.bind(this),
      'other_opportunityedit': this.useropportunityEdit.bind(this),

    };
    return setupIndex[selector]();
  }

  adminopportunityEdit(): void {
    console.log('here i am!');
    if (this.opportunityId) this.getResource(this.opportunityId);
    if (this.approved) this.showButtonGroup();
    this.approveBtn = false;

  }
  useropportunityEdit(): void {
    if (this.opportunityId) this.getResource(this.opportunityId);

  }

  adminopportunityAdd(): void {
    if (!this.opportunityId)
      this.multiSelectPreFlight();
    this.setTitle('New opportunity');
    this.showButtonGroup();
  }

  useropportunityAdd(): void {
    if (!this.opportunityId)
      this.multiSelectPreFlight();
    this.setTitle('New opportunity');
    this.showButtonGroup();
  }


  onCareerSelect(item: any) {
    this.onChange(item);
  }
  onCareerDeSelect(item: any) {
    this.onChange(item);
  }

  onOrganizationSelect(item: any) {
    this.opportunity.organization_id = item.id;
    this.onChange(item);
  }
  onOrganizationDeSelect(item: any) {
    this.onChange(item);
  }

  onChange(event): void {
    if (this.editFlag) {
      if (this.opportunity.title !== this.originalOpportunity.title) {
        this.disableFlag = false;
        return;
      }
      if (this.opportunity.details !== this.originalOpportunity.details) {
        this.disableFlag = false;
        return;
      }
      if (this.opportunity.link !== this.originalOpportunity.link) {
        this.disableFlag = false;
        return;
      }
      if (this.selectedOrganization.length === 0) {
        this.disableFlag = false;
        return;
      } else if (this.selectedOrganization[0].id !== this.originalOpportunity.organization_id) {
        this.disableFlag = false;
        return;
      }
      if (this.opportunity.is_active !== this.originalOpportunity.is_active) {
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
      this.opportunity = res;
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
      this.originalOpportunity = Object.assign({}, res);
      if (!this.originalOpportunity.is_active) {
        this.originalOpportunity.is_active = false;
      }
      if (this.organizationList.length > 0) {
        let org = this.organizationList.find(organization => organization.id === this.opportunity.organization_id);
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

  saveOpportunity(valid: boolean): void {

    if (!valid) {
      return;
    }

    if (!this.validURL(this.opportunity.link)) {
      alert('Please input valid url link');
      return;
    }

    if (this.selectedOrganization.length === 0) {
      return;
    }
    if (!this.opportunity.is_active) {
      this.opportunity.is_active = false;
    }

    this.opportunity.type = 'Other';

    this.opportunity.organization_id = this.selectedOrganization[0].id;

    this.opportunity.career_ids = this.selectedCareers.map(career => {
      return career.id;
    });

    this.creating = true;
    if (!this.opportunity.id) {
      this.resourcesService.createResource(this.opportunity).subscribe((res) => {
        this.creating = false;
        alert('Create new opportunity successfully');
        this.global.selectedTab = 'opportunities';
        this.router.navigate(['resources']);
      }, (errors) => {
        this.creating = false;
        alert('Server error');
      });
    } else {
      this.resourcesService.updateResource(this.opportunity).subscribe((res) => {
        this.creating = false;
        alert('Update opportunity successfully');
        this.global.selectedTab = 'opportunities';
        this.router.navigate(['resources']);
      }, (errors) => {
        this.creating = false;
        alert('Server error');
      });
    }
  }

  approve(): void {
    this.resourcesService.opportunityApprove(this.opportunityId).subscribe((res) => {
      alert('Opportunity Approved');
      this.router.navigate(['approvals']);
    }, err => {
      alert(err);
    });
  }

  reject(): void {
    this.resourcesService.opportunityReject(this.opportunityId).subscribe((res) => {
      alert('Opportunity Rejected');
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

  deleteOpportunity(): void {

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
