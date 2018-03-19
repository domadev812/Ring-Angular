import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ResourcesService } from '../../_services/resources.service';
import { Router, Routes, RouterModule } from '@angular/router';
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
  public infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  public searchText: string;
  public scholarships: Array<Model.Scholarship>;
  public organizations: Array<Model.Organization>;
  public loading = false;

  constructor(private router: Router,
    private resourcesService: ResourcesService) { }

  ngOnInit() {
    this.scholarships = new Array<Model.Scholarship>();
    this.organizations = new Array<Model.Organization>();
    this.limit = 50;
    this.offset = 0;
    this.searchText = '';
    this.getScholarships();
    this.loading = true;
  }

  editScholarship(id) {
    this.router.navigate(['scholarshipedit/' + id]);
  }

  searchItems(): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getScholarships();
  }

  getScholarships(): void {
    this.resourcesService.getScholarships(this.offset, this.limit, this.searchText).subscribe((res) => {
      this.loading = false;
      this.scholarships = res.map(scholarship => scholarship);
      this.offset += res.length;
    }, (errors) => {
      this.loading = false;
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      //use this to handle *ngIf if you want to tell the user the infinite scroll is loading.
      this.infiniteScrollLoading = true;
      return this.resourcesService.getScholarships(this.offset, this.limit, this.searchText).do(this.infiniteScrollCallBack.bind(this));
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
}