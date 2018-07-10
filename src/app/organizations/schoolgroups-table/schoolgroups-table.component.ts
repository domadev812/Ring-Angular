import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { GroupService, AccessService, AuthService, CurrentUserService } from '../../app.services-list';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { ToastService } from '../../_services/toast.service';

@Component({
  selector: 'app-schoolgroups-table',
  templateUrl: './schoolgroups-table.component.html',
  styleUrls: ['./schoolgroups-table.component.scss']
})
export class SchoolGroupsTableComponent implements OnInit {
  @ViewChild('scrollVariable')
  private scrollableContainer: ElementRef;
  private moreContentAvailable = true;
  public infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  public searchText: string;
  public loading = false;
  public canUseEditSchoolGroup: boolean;

  school_groups: Model.Group[];

  constructor(
    private http: Http,
    private groupService: GroupService,
    public router: Router,
    public access: AccessService,
    private authProvider: AuthService,
    private currentUserService: CurrentUserService,
    public toastService: ToastService
  ) { }

  ngOnInit() {
    this.getSchoolGroups();
    this.school_groups = [];
    this.searchText = '';
    this.offset = 0;
    this.limit = 50;
  }

  getUser() {
    this.currentUserService.getCurrentUser(this.authProvider).then((user: Model.User) => {
      if (user) {
        this.canUseEditSchoolGroup = this.access.getAccess(user.getRole()).functionalityAccess.canEditSchoolGroup;
      }
    });
  }

  searchItems(): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getSchoolGroups();
  }

  getSchoolGroups(): void {
    this.loading = true;
    this.groupService.getSchoolGroups('school', 0, this.limit, this.searchText).subscribe((res) => {
      this.loading = false;
      this.school_groups = res.map(group => group);
      this.offset += res.length;
    }, (errors) => {
      this.loading = false;
      this.toastService.showError('Server error');;
    });
  }

  editSchoolGroup(group_id: string): void {
    this.router.navigate([`newgroupedit/${group_id}`]);
  }

  myScrollCallBack(): Observable<Model.Group[]> {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;

      return this.groupService.getSchoolGroups('school', this.limit).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res): void {
    res.map(organization => {
      this.school_groups.push(organization);
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }

}
