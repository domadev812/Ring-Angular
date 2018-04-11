import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PrizesService } from '../../_services/prizes.service';
import { Router, Routes, RouterModule } from '@angular/router';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';
import * as moment from 'moment';
import { Campaign } from '../../_models/campaign.model';


@Component({
  selector: 'app-prizesindex',
  templateUrl: './prizesindex.component.html',
  styleUrls: ['./prizesindex.component.scss']
})
export class PrizesIndexComponent implements OnInit {
  @ViewChild('scrollVariable') private scrollableContainer: ElementRef;
  private moreContentAvailable = true;
  public infiniteScrollLoading: boolean;
  public prizes: Array<Model.Prize>; // We need to pass this as a input to prizes-table Module
  private limit: number;
  private offset: number;
  public searchText: string;
  public loading = false;

  constructor(private router: Router, private prizesService: PrizesService) { }

  ngOnInit() {
    this.prizes = new Array<Model.Prize>();
    this.limit = 50;
    this.offset = 0;
    this.getPrizes();
  }

  editPrize(id) {
    this.router.navigate(['prizeedit/' + id]);
  }

  searchItems(): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getPrizes();
  }

  getPrizes(): void {
    this.loading = true;
    this.prizesService.getPrizes(this.offset, this.searchText).subscribe((res) => {
      this.loading = false;
      this.prizes = res.map(prize => prize);
      this.offset += res.length;
    }, (errors) => {
      this.loading = false;
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;
      return this.prizesService.getPrizes(this.offset, this.searchText).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res) {
    res.map(prize => {
      this.prizes.push(prize);
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }

  formatDate(date: any): string {
    return date ? moment(date, moment.ISO_8601)
      .format('DD  MMM  YYYY') : '';
  }

  getKeyValue(campaign: Model.Campaign, key: string): any {
    if (campaign && campaign[key] != undefined) {
      return campaign[key];
    }
    return '';
  }
}
