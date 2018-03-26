import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ResourcesService } from '../../_services/resources.service';
import { Router, Routes, RouterModule } from '@angular/router';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.scss']
})
export class OpportunitiesComponent implements OnInit {
  @ViewChild('scrollVariable') private scrollableContainer: ElementRef;
  private moreContentAvailable = true;
  public infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  public searchText: string;
  public opportunities: Array<Model.Resource>;
  public organizations: Array<Model.Organization>;
  public loading = false;

  constructor(private router: Router, private resourcesService: ResourcesService) { }

  ngOnInit() {
    this.opportunities = new Array<Model.Resource>();
    this.organizations = new Array<Model.Organization>();
    this.limit = 50;
    this.offset = 0;
    this.getOpportunities();
    this.loading = true;
  }

  editOpportunity(id) {
    this.router.navigate(['opportunityedit/' + id]);
  }

  searchItems(): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getOpportunities();
  }

  getOpportunities(): void {
    this.resourcesService.getResources('Other', this.offset, this.searchText).subscribe((res) => {
      this.loading = false;
      this.opportunities = res.map(opportunity => opportunity);
      this.offset += res.length;
    }, (errors) => {
      alert('Server error');
      this.loading = false;
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;
      return this.resourcesService.getResources('Other', this.offset, this.searchText).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res) {
    res.map(opportunity => {
      this.opportunities.push(opportunity);
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }
}
