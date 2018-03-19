import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PrizesService } from '../../_services/prizes.service';
import { Router, Routes, RouterModule } from '@angular/router';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';

@Component({
  selector: 'app-awardedprizesindex',
  templateUrl: './awardedprizesindex.component.html',
  styleUrls: ['./awardedprizesindex.component.scss']
})
export class AwardedPrizesIndexComponent implements OnInit {

  moreContentAvailable = true;
  infiniteScrollLoading: boolean;
  awards: Array<Model.AwardedPrize>;
  limit: number;
  offset: number;
  searchText: string;
  public loading = false;

  constructor(
    public router: Router,
    public prizesService: PrizesService
  ) { }

  ngOnInit() {
    this.awards = new Array<Model.AwardedPrize>();
    this.limit = 50;
    this.offset = 0;
    this.getAwardedPrizes();
  }

  searchItems(event): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getAwardedPrizes();
  }

  getAwardedPrizes(): void {
    this.loading = true;
    this.prizesService.getAwardedPrizes(this.offset, this.searchText).subscribe((res) => {
      this.loading = false;
      this.awards = res.map(award => award);
      this.offset += res.length;
    }, (errors) => {
      this.loading = false;
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;
      return this.prizesService.getKeyCards(this.offset, this.searchText).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res) {
    res.map(prize => {
      this.awards.push(prize);
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }

}
