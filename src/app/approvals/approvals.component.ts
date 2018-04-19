import { Component, OnInit } from '@angular/core';
import 'rxjs/add/observable/throw';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { NavbarService, ApprovalsService, NotificationsService, ResourcesService } from '../app.services-list';
import { Model } from '../app.models-list';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss']
})
export class ApprovalsComponent implements OnInit {

  selectedTab: String;
  approvals: Array<Model.Approval>;
  public loading = false;
  private moreContentAvailable = true;
  public infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;

  constructor(
    private router: Router,
    private navBarService: NavbarService,
    private approvalsService: ApprovalsService,
    private notificationsService: NotificationsService,
    private resourcesService: ResourcesService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.navBarService.show();
    this.navBarService.activeTabChanged('approvals');
    this.selectedTab = 'approvals';
    this.approvals = new Array<Model.Approval>();
    this.getApprovals();
  }

  getApprovals() {
    this.approvalsService.getApprovals().subscribe((res) => {
      this.approvals = res.map(approval => approval);
      this.loading = false;
    }, (errors) => {
      this.loading = false;
      alert('Server error');
    });
  }


  infiniteScrollCallBack(res) {
    res.map(approval => {
      this.approvals.push(approval);
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }

  approveItem(type: string, id: any) {
    if (type === 'Notification') {
      this.router.navigate(['notificationview/' + id]);
    } else if (type === 'Scholarship') {
      this.router.navigate(['scholarshipedit/' + id]);
    } else if (type === 'Other') {
      this.router.navigate(['opportunityedit/' + id]);
    } else if (type === 'Internship') {
      this.router.navigate(['internshipedit/' + id]);
    }
  }
}

