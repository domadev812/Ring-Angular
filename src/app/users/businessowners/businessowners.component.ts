import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from '../../_services/users.service';
import { ResourcesService } from '../../_services/resources.service';
import { Router, Routes, RouterModule } from '@angular/router';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';
import { User as ApiUser } from '../../_models/user.model';

@Component({
  selector: 'app-businessowners',
  templateUrl: './businessowners.component.html',
  styleUrls: ['./businessowners.component.scss']
})
export class BusinessOwnersComponent implements OnInit {
  @ViewChild('scrollVariable') private scrollableContainer: ElementRef;
  private moreContentAvailable = true;
  public infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  public searchText: string;
  public businessowners: Array<ApiUser>;
  public organizations: Array<Model.Organization>;
  public loading = false;

  constructor(private router: Router,
    private usersService: UsersService) { }

  ngOnInit() {
    this.businessowners = new Array<ApiUser>();
    this.organizations = new Array<Model.Organization>();
    this.limit = 50;
    this.offset = 0;
    this.getBusinessOwners();
  }

  editBusinessOwner(id) {
    this.router.navigate(['useredit/' + id]);
  }

  searchItems(): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getBusinessOwners();
  }

  getBusinessOwners(): void {
    this.loading = true;
    this.usersService.getUsers('business_owner', this.offset, this.searchText).subscribe((res) => {
      this.loading = false;
      this.businessowners = res.map(businessowner => businessowner);
      this.offset += res.length;
    }, (errors) => {
      this.loading = false;
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;
      return this.usersService.getUsers('business_owner', this.offset, this.searchText).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res) {
    res.map(businessowner => {
      this.businessowners.push(businessowner);
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }
}
