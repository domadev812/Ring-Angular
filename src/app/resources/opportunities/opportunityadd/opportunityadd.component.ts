import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { error } from 'util';
import { MultiSelectService, ResourcesService } from '../../../app.services-list';
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
  public ktsSelectSettings = {};
  public ktsMultiSettings = {};
  public careerList = [];   //Selectable Career List
  public selectedCareers = [];    //Selected Career List
  public title: string;
  public editFlag: boolean;
  public disableFlag: boolean;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private resourcesService: ResourcesService,
    private multiSelectService: MultiSelectService,
    public global: GlobalState,
    public navBarService: NavbarService,
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.opportunity = new Model.Resource({});
    this.originalOpportunity = new Model.Resource({});
    this.careers = new Array<Model.Career>();
    this.organizations = new Array<Model.Organization>();
    this.title = 'New Opportunity';
    this.editFlag = false;
    this.disableFlag = false;

    this.ktsSelectSettings = MultiSelectUtil.singleSelection;
    this.ktsMultiSettings = MultiSelectUtil.multiSettings;
    this.getCareers();
    this.getOrganizations();

    const id = this.route.snapshot.paramMap.get('opportunityId');
    if (id !== null) {
      this.title = 'Edit Opportunity';
      this.editFlag = true;
      this.disableFlag = true;
      this.getResource(id);
    }

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
    this.resourcesService.getResource(id).subscribe((res) => {
      this.opportunity = res;
    }, (errors) => {
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
    this.opportunity.organization_id = this.selectedOrganization[0].id;
    this.opportunity.type = 'Other';
    this.opportunity.career_titles = Array<number>();
    for (let career of this.selectedCareers) {
      this.opportunity.career_titles.push(career.id);
    }

    if (!this.opportunity.id) {
      this.resourcesService.createResource(this.opportunity).subscribe((res) => {
        alert('Create new opportunity successfully');
        this.global.selectedTab = 'opportunities';
        this.router.navigate(['resources']);
      }, (errors) => {
        alert('Server error');
      });
    } else {
      this.resourcesService.updateResource(this.opportunity).subscribe((res) => {
        alert('Update opportunity successfully');
        this.global.selectedTab = 'opportunities';
        this.router.navigate(['resources']);
      }, (errors) => {
        alert('Server error');
      });
    }
  }

  goBack(event): void {
    this.router.navigate(['resources']);
  }

  gotoApplicants(id): void {
    this.router.navigate(['applicants/' + id]);
  }

  deleteOpportunity(event): void {

  }

  validURL(url: string) {
    // tslint:disable-next-line:max-line-length
    const pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return pattern.test(url);
  }
}
