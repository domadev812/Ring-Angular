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
  private infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  public searchText: string;
  public businessowners: Array<ApiUser>;
  public organizations: Array<Model.Organization>;  

  constructor(private usersService: UsersService, 
              private resourcesService: ResourcesService) { }

  ngOnInit() {
    this.businessowners = new Array<ApiUser>();
    this.organizations = new Array<Model.Organization>();
    this.limit = 50;
    this.offset = 0;
    this.getBusinessOwners();
  }

  editBusinessOwner(id) {
  }

  searchItems(event): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getBusinessOwners();    
  }

  getBusinessOwners(): void {
    this.usersService.getUsers('business_owner', this.offset, this.searchText).subscribe((res) => {
      this.businessowners = res.map(businessowner => businessowner);
      this.offset += res.length;      
    }, (errors) => {
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;      
      return this.usersService.getUsers('key_contact', this.offset, this.searchText).do(this.infiniteScrollCallBack.bind(this));
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
