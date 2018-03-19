import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from '../../_services/users.service';
import { ResourcesService } from '../../_services/resources.service';
import { Router, Routes, RouterModule } from '@angular/router';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';
import { User as ApiUser } from '../../_models/user.model';

@Component({
  selector: 'app-counselors',
  templateUrl: './counselors.component.html',
  styleUrls: ['./counselors.component.scss']
})
export class CounselorsComponent implements OnInit {
  @ViewChild('scrollVariable') private scrollableContainer: ElementRef;
  private moreContentAvailable = true;
  public infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  public searchText: string;
  public counselors: Array<ApiUser>;
  public organizations: Array<Model.Organization>;
  public loading = false;

  constructor(private router: Router,
    private usersService: UsersService) { }

  ngOnInit() {
    this.counselors = new Array<ApiUser>();
    this.organizations = new Array<Model.Organization>();
    this.limit = 50;
    this.offset = 0;
    this.getCounselors();
  }

  editCounselor(id) {
    this.router.navigate(['useredit/' + id]);
  }

  searchItems(): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getCounselors();
  }

  getCounselors(): void {
    this.loading = true;
    this.usersService.getUsers('counselor', this.offset, this.searchText).subscribe((res) => {
      this.loading = false;
      this.counselors = res.map(counselor => counselor);
      this.offset += res.length;
    }, (errors) => {
      this.loading = false;
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;
      return this.usersService.getUsers('counselor', this.offset, this.searchText).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res) {
    res.map(counselor => {
      this.counselors.push(counselor);
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }
}
