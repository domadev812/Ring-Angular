import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ResourcesService } from '../../_services/resources.service';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';

@Component({
  selector: 'app-scholarships',
  templateUrl: './scholarships.component.html',
  styleUrls: ['./scholarships.component.scss']
})

export class ScholarshipsComponent implements OnInit {

  @ViewChild('scrollVariable') private scrollableContainer: ElementRef;

  private moreContentAvailable = true;
  private infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  public searchText: string;
  public scholarships: Array<Model.Resource>;
  public organizations: Array<Model.Organization>;  

  constructor(private resourcesService: ResourcesService) { }

  ngOnInit() {
    this.scholarships = new Array<Model.Resource>();
    this.organizations = new Array<Model.Organization>();
    this.limit = 50;
    this.offset = 0;
    this.searchText = '';
    this.getOrganizationSize();
  }

  searchItems(event): void {    
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getScholarships();    
  }

  getScholarships(): void {
    this.resourcesService.getResources('Scholarship', this.offset, this.searchText).subscribe((res) => {
      this.scholarships = res.map(scholarship => scholarship);
      this.offset += res.length;
    }, (errors) => {
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      //use this to handle *ngIf if you want to tell the user the infinite scroll is loading.
      this.infiniteScrollLoading = true;
      return this.resourcesService.getResources('Scholarship', this.offset, this.searchText).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res) {
    res.map(scholarship => {
      this.scholarships.push(scholarship);      
    });
    this.offset += res.length;
    //Stops getting content if there is no content
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }

  getOrganizationSize(): void {
    this.resourcesService.getOrganizationSize().subscribe((res) => {
      this.getOrganizations(res);
    }, (errors) => {
      alert('Server error');
    });
  }

  getOrganizations(size): void {
    this.resourcesService.getOrganizations(size).subscribe((res) => {
      this.organizations = res.map(organization => organization);
      this.getScholarships();
    }, (errors) => {
      alert('Server error');
    });
  }

  getOrganizationNameById(id): string {
    let findOrganization = this.organizations.find(organization => organization.id === id);
    return findOrganization.name;
  }
}