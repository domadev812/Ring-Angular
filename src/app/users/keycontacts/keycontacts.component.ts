import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UsersService } from '../../_services/users.service';
import { ResourcesService } from '../../_services/resources.service';
import { Router, Routes, RouterModule } from '@angular/router';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';
import { User as ApiUser } from '../../_models/user.model';

@Component({
  selector: 'app-keycontacts',
  templateUrl: './keycontacts.component.html',
  styleUrls: ['./keycontacts.component.scss']
})
export class KeyContactsComponent implements OnInit {
  @ViewChild('scrollVariable') private scrollableContainer: ElementRef;
  private moreContentAvailable = true;
  public infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  public searchText: string;
  public keycontacts: Array<ApiUser>;
  public organizations: Array<Model.Organization>;

  constructor(private usersService: UsersService,
    private resourcesService: ResourcesService) { }

  ngOnInit() {
    this.keycontacts = new Array<ApiUser>();
    this.organizations = new Array<Model.Organization>();
    this.limit = 50;
    this.offset = 0;
    this.getKeyContacts();
  }

  editKeyContact(id) {
  }

  searchItems(): void {
    this.offset = 0;
    this.moreContentAvailable = true;
    this.getKeyContacts();
  }

  getKeyContacts(): void {
    this.usersService.getUsers('key_contact', this.offset, this.searchText).subscribe((res) => {
      this.keycontacts = res.map(keycontact => keycontact);
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
    res.map(keycontact => {
      this.keycontacts.push(keycontact);
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }
}
