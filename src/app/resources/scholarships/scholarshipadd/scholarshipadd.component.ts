import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { error } from 'util';
import { MultiSelectService, ResourcesService } from '../../../app.services-list';
import { Model } from '../../../app.models-list';
import { MultiSelectUtil } from '../../../_utils/multiselect.util';
import { FormsModule } from '@angular/forms';
import { NavbarService } from '../../../app.services-list';

@Component({
  selector: 'app-scholarshipadd',
  templateUrl: './scholarshipadd.component.html',
  styleUrls: ['./scholarshipadd.component.scss']
})
export class ScholarshipAddComponent implements OnInit {
  public scholarship: Model.Scholarship;
  public careers: Array<Model.Career>;
  public schools: Array<Model.Organization>;
  public ethnicities: Array<Model.Ethnicity>;
  public organizations: Array<Model.Organization>;
  public ktsSelectSettings = {};
  public ktsMultiSettings = {};
  public ethnicityList = [];
  public selectedEthnicities = [];
  public careerList = [];
  public selectedCareers = [];
  public schoolList = [];
  public selectedSchools = [];
  public organizationList = [];
  public selectedOrganization = [];
  public title: string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private multiSelectService: MultiSelectService,
    private resourcesService: ResourcesService,
    private navBarSerice: NavbarService,
  ) {
  }
  ngOnInit() {
    this.navBarSerice.show();
    this.scholarship = new Model.Scholarship({});
    this.schools = new Array<Model.Organization>();
    this.ethnicities = new Array<Model.Ethnicity>();
    this.organizations = new Array<Model.Organization>();
    this.title = 'New scholarship';
    this.getEthnicities();
    this.getCareers();
    this.getSchools();
    this.getOrganizations();

    this.ktsSelectSettings = MultiSelectUtil.singleSelection;
    this.ktsMultiSettings = MultiSelectUtil.multiSettings;
  }

  onSchoolSelect(item: any) {
  }
  onSchoolDeSelect(item: any) {
  }

  getSchools(): void {
    this.multiSelectService.getDropdownSchools().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.schoolList = res;
    }, err => {
      console.log('err', err);
    });
  }

  onCareerSelect(item: any) {
  }
  onCareerDeSelect(item: any) {
  }

  getCareers(): void {
    this.multiSelectService.getDropdownCareers().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.careerList = res;
    }, err => {
      console.log('err', err);
    });
  }

  onEthnicitySelect(item: any) {
  }
  onEthnicitDeSelect(item: any) {
  }

  getEthnicities(): void {
    this.multiSelectService.getDropdownEthnicities().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.ethnicityList = res;
    }, err => {
      console.log('err', err);
    });
  }

  onOrganizationSelect(item: any) {
    this.scholarship.organization_id = item.id;
  }
  onOrganizationDeSelect(item: any) {
  }

  getOrganizations(): void {
    this.multiSelectService.getDropdownOrganizations().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.organizationList = res;
    }, err => {
      console.log('err', err);
    });
  }


  saveScholarship(valid: boolean): void {

    if (!valid) {
      return;
    }

    if (!this.scholarship.is_active) {
      this.scholarship.is_active = false;
    }

    this.scholarship.type = 'scholarship';

    this.scholarship.career_titles = Array<number>();
    for (let career of this.selectedCareers) {
      this.scholarship.career_titles.push(career.id);
    }

    this.scholarship.ethnicity_ids = Array<string>();
    for (let ethnicity of this.selectedEthnicities) {
      this.scholarship.ethnicity_ids.push(ethnicity.id);
    }
    this.scholarship.school_ids = Array<string>();
    for (let school of this.selectedSchools) {
      this.scholarship.school_ids.push(school.id);
    }

    if (!this.scholarship.id) {
      this.resourcesService.createScholarship(this.scholarship).subscribe((res) => {
        alert('Create new scholarship successfully');
        this.scholarship = res;
      }, (errors) => {
        alert('Server error');
      });
    } else {
      this.resourcesService.updateScholarship(this.scholarship).subscribe((res) => {
        alert('Update scholarship successfully');
      }, (errors) => {
        alert('Server error');
      });
    }
  }

  goBack(event): void {
    this.router.navigate(['resources']);
  }

  deleteInternship(event): void {

  }

  validURL(url: string) {
    // tslint:disable-next-line:max-line-length
    const pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return pattern.test(url);
  }


}
