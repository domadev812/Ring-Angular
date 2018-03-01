import { Component, OnInit } from '@angular/core';
import { Router, Routes, RouterModule } from '@angular/router';
import * as Services from '../app.services-list';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  public selectedTab: String = '';

  constructor(
    private router: Router,
    private currentUserService: Services.CurrentUserService,
    private navBarService: Services.NavbarService,
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.selectedTab = 'student';
  }

  addNewUser(event): void {        
    this.router.navigate(['useradd']);
  }

  switchTab(selectedTab: String): void {
    this.selectedTab = selectedTab;
  }
}
