import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PrizesService } from '../../_services/prizes.service';
import { Router, Routes, RouterModule } from '@angular/router';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-keycardindex',
  templateUrl: './keycardindex.component.html',
  styleUrls: ['./keycardindex.component.scss']
})
export class KeycardindexComponent implements OnInit {

  @ViewChild('scrollVariable') private scrollableContainer: ElementRef;

  moreContentAvailable = true;
  infiniteScrollLoading: boolean;
  KeycardRecipients: Array<Model.KeycardRecipient>;
  limit: number;
  offset: number;
  searchText: string;
  public loading = false;

  constructor(
    public router: Router,
    public prizesService: PrizesService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.KeycardRecipients = new Array<Model.KeycardRecipient>();
    this.limit = 50;
    this.offset = 0;
    this.searchText = '';
    this.getKeycardIndex();
  }

  searchItems(): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getKeycardIndex();
  }

  getKeycardIndex(): void {
    this.prizesService.getKeycardIndex(this.offset, this.limit, this.searchText).subscribe((res) => {
      this.loading = false;
      this.KeycardRecipients = res.map(KeycardRecipient => KeycardRecipient);
      this.offset += res.length;
    }, (errors) => {
      this.loading = false;
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;

      return this.prizesService.getKeycardIndex(this.limit).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res) {
    res.map(KeycardRecipient => {
      this.KeycardRecipients.push(KeycardRecipient);
    });
    this.offset += res.length;
    //Stops getting content if there is no content
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }



}
