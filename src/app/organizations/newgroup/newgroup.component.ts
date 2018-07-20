import { Component, OnInit } from '@angular/core';
import { Model } from '../../app.models-list';
import { MultiSelectUtil } from '../../_utils/multiselect.util';
import { FormsModule } from '@angular/forms';
import { MultiSelectService, NavbarService, AuthService, AccessService, GroupService } from '../../app.services-list';
import { ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';
import { Group } from '../../_models/group.model';
import { GlobalState } from '../../global.state';

@Component({
  selector: 'app-newgroup',
  templateUrl: './newgroup.component.html',
  styleUrls: ['./newgroup.component.scss']
})
export class NewgroupComponent implements OnInit {

  public selectAllMultiSettings: MultiSelectUtil.ISelectSettings;
  public schools: Array<Model.Organization>;
  public schoolList = [];
  public selectedGroup = [];
  public title: string;
  public disableFlag: boolean;
  public editFlag: boolean;
  public schoolGroup: Model.Group;
  public creating = false;
  public schoolGroupId: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private multiSelectService: MultiSelectService,
    private navBarService: NavbarService,
    private authProvider: AuthService,
    private access: AccessService,
    private groupService: GroupService,
    public global: GlobalState,

  ) { }

  ngOnInit() {
    this.schoolGroupId = this.route.snapshot.paramMap.get('id');
    this.navBarService.show();
    this.navBarService.activeTabChanged('organizations');
    this.schools = new Array<Model.Organization>();
    this.schoolGroup = new Model.Group({}); this.selectAllMultiSettings = MultiSelectUtil.multiSettings();
    this.getSchools();
    this.setTitle();
  }

  setTitle(title: string = null) {
    if (this.schoolGroupId) {
      this.title = 'Edit School Group';
      this.getSchoolGroup(this.schoolGroupId);
    } else {
      this.title = 'New School Group';
    }
  }

  getSchoolGroup(id: string) {
    this.groupService.getGroup(id).subscribe((res) => {
      this.schoolGroup = res;
      this.selectedGroup = res.organizations.map(organization => new MultiSelectUtil.SelectItem(organization.name, organization.id));
      console.log('this is the response', res);
    });
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
    return this.selectedGroup.length > 0 ? false : true;
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

  saveSchoolGroup(valid: boolean): void {

    if (!valid) {
      return;
    }

    if (this.selectedGroup.length === 0) {
      return;
    }

    this.schoolGroup.organization_ids = this.selectedGroup.map(organizations => {
      return organizations.id;
    });

    if (!this.schoolGroupId)
      this.groupService.createGroup(this.schoolGroup).subscribe((res) => {
        console.log('here is the schoolGroup', this.schoolGroup);
        alert('Created School Group Succesfully');
        this.router.navigate(['organizations']);
        this.schoolGroup = res;
      }, (errors) => {
        alert('Server error');
      });
    else
      this.groupService.updateGroup(this.schoolGroup).subscribe((res) => {
        alert('Update School Group successfully');
        this.global.selectedTab = 'organizations';
        this.router.navigate(['organizations']);
      }, (errors) => {
        alert('Server error');
      });
  }

  goBack(): void {
    this.router.navigate(['organizations']);
  }
}
