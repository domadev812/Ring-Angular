import { Component, OnInit } from '@angular/core';
import { Model } from '../../app.models-list';
import { MultiSelectUtil } from '../../_utils/multiselect.util';
import { FormsModule } from '@angular/forms';
import { MultiSelectService, NavbarService, AuthService, AccessService, OrganizationService } from '../../app.services-list';
import { ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';
import { SchoolGroup } from '../../_models/school-group.model';

@Component({
  selector: 'app-newgroup',
  templateUrl: './newgroup.component.html',
  styleUrls: ['./newgroup.component.scss']
})
export class NewgroupComponent implements OnInit {

  public selectAllMultiSettings: any = {};
  public schools: Array<Model.Organization>;
  public schoolList = [];
  public selectedSchools = [];
  public title: string;
  public disableFlag: boolean;
  public editFlag: boolean;
  public schoolGroup: Model.SchoolGroup;
  public creating = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private multiSelectService: MultiSelectService,
    private navBarService: NavbarService,
    private authProvider: AuthService,
    private access: AccessService,
    private organizationService: OrganizationService,

  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('organizations');
    this.schools = new Array<Model.Organization>();
    this.schoolGroup = new Model.SchoolGroup({});
    this.title = 'New School Group';
    this.selectAllMultiSettings = MultiSelectUtil.multiSettings;
    this.getSchools();
  }


  getSchools(): void {
    this.multiSelectService.getDropdownSchools().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.schoolList = res;
    }, err => {
      console.log('err', err);
    });
  }

  isSchoolChanged(): boolean {
    // TODO: Update once lodash is added
    return this.selectedSchools.length > 0 ? false : true;
  }

  onSchoolSelect(item: any) {
    this.onChange(item);
  }

  onSchoolDeSelect(item: any) {
    this.onChange(item);
  }

  onChange(event): void {
    if (this.editFlag) {

      if (!this.isSchoolChanged()) {
        this.disableFlag = false;
        return;
      }

      this.disableFlag = true;
    }
  }

  saveSchoolGroup(): void {
    this.creating = true;
    this.organizationService.saveSchoolGroup(this.schoolGroup).subscribe((res) => {
      this.creating = false;
      alert('Created School Group Succesfully');
      this.router.navigate(['organizations']);
      this.schoolGroup = res;
    }, (errors) => {
      this.creating = false;
      alert('Server error');
    });
  }

  goBack(): void {
    this.router.navigate(['organizations']);
  }
}
