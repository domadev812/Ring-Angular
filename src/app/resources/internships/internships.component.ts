import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ResourcesService } from '../../_services/resources.service';
import { Router, Routes, RouterModule } from '@angular/router';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';

@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.scss']
})
export class InternshipsComponent implements OnInit {
  @ViewChild('scrollVariable') private scrollableContainer: ElementRef;
  private moreContentAvailable = true;
  public infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  public searchText: string;
  public internships: Array<Model.Resource>;
  public organizations: Array<Model.Organization>;
  public loading = false;

  constructor(private router: Router, private resourcesService: ResourcesService) { }

  ngOnInit() {
    this.internships = new Array<Model.Resource>();
    this.organizations = new Array<Model.Organization>();
    this.limit = 50;
    this.offset = 0;
    this.getInternships();
    this.loading = true;
  }

  editInternship(id) {
    this.router.navigate(['internshipedit/' + id]);
  }

  searchItems(): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getInternships();
  }

  getInternships(): void {
    this.resourcesService.getResources('internship', this.offset, this.searchText).subscribe((res) => {
      this.loading = false;
      this.internships = res.map(internship => internship);
      this.offset += res.length;
    }, (errors) => {
      this.loading = false;
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;
      return this.resourcesService.getResources('internship', this.offset, this.searchText).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res) {
    res.map(internship => {
      this.internships.push(internship);
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }

}
