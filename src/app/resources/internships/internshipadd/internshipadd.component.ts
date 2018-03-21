import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { error } from 'util';
import { MultiSelectService, ResourcesService, CurrentUserService, AuthService } from '../../../app.services-list';
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
  public ktsMultiSettings = {};
  public careerList = [];   //Selectable Career List
  public selectedCareers = [];    //Selected Career List
  public title: string;
  public editFlag: boolean;
  public disableFlag: boolean;
  public opportunity = [];
  public currentCareers = [];
  public creating = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private resourcesService: ResourcesService,
    private multiSelectService: MultiSelectService,
    public global: GlobalState,
    public navBarService: NavbarService,
    private currentUserService: CurrentUserService,
    private authProvider: AuthService
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('resources');    
    this.internship = new Model.Resource({});
    this.originalInternship = new Model.Resource({});
    this.careers = new Array<Model.Career>();
    this.career_ids = new Array<Model.Career>();
    this.title = 'New Internship';
    this.editFlag = false;
    this.disableFlag = false;

    this.ktsMultiSettings = MultiSelectUtil.multiSettings;

    const id = this.route.snapshot.paramMap.get('internshipId');
    if (id !== null) {
      this.title = 'Edit Internship';
      this.editFlag = true;
      this.disableFlag = true;

      this.getResource(id);
    }
    this.getUser();
    this.getCareers();
    this.getOrganizations();
  }

  getUser() {
    this.currentUserService.getCurrentUser(this.authProvider).then((res: Model.User) => {
      if (res) {
        this.setAdminStatus(res.roles);
        const org = res.organization;
        this.selectedOrganization.push(new MultiSelectUtil.SelectItem(org.name, this.internship.id));
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


  onCareerSelect(item: any) {
    this.onChange(item);
    console.log('on select careers', this.selectedCareers);
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
      const parsedCareers = res.careers.map(careers => {
        careers.title = careers.title;
        careers.id = careers.id;
        return careers;
      });
      this.selectedCareers = MultiSelectUtil.SelectItem.buildFromData(parsedCareers, 'Career');
      this.internship = res;
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
}
