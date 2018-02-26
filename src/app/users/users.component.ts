import { Component, OnInit } from '@angular/core';
import * as Services from '../app.services-list';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public selectedTab: String = ''; 

  constructor(
    private currentUserService: Services.CurrentUserService
  ) { }

  ngOnInit() {
    this.selectedTab = 'students';
  }

  addNewUser(event): void {    
  }

  switchTab(selectedTab: String): void {
    this.selectedTab = selectedTab;
  }
}
