import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Http, Response } from '@angular/http';
import { OrganizationService  } from '../../app.services-list';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';
import { Observable } from 'rxjs/Observable';
import { Organization } from '../../_models/organization.model';

@Component({
  selector: 'app-sponsors-table',
  templateUrl: './sponsors-table.component.html',
  styleUrls: ['./sponsors-table.component.scss']
})
export class SponsorsTableComponent implements OnInit {
  @ViewChild('scrollVariable')
  private scrollableContainer: ElementRef;
  private moreContentAvailable = true;
  private infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  public searchText: string;

  organizations: Model.Organization[];

  constructor(private http: Http,
              private organizationService: OrganizationService
              ) { }

  ngOnInit() {
    this.getOrganizations();
    this.organizations = [];
    this.searchText = '';
    this.offset = 0;
    this.limit = 50;
  }

  searchItems(): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getOrganizations();
  }
  
  getOrganizations(): void {
    this.organizationService.getOrganizationSearch('sponsor', 0, this.limit, this.searchText).subscribe((res) => {
      this.organizations = res.map(organization => organization);
      this.offset += res.length;
    });
  }

  myScrollCallBack(): Observable<Organization[]> {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true; 

      return this.organizationService.getOrganizationSearch('sponsor', this.offset, this.limit).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res): void {
    res.map(organization => {
      this.organizations.push(organization);      
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }

}
