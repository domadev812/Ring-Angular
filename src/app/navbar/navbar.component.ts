import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../app.services-list';
import * as Services from '../app.services-list';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  tab: String;
  active: boolean;

  constructor(
    public navBarService: NavbarService,
    private authService: Services.AuthService
  ) { }

  ngOnInit() {
    this.tab = window.location.pathname.substring(1);
  }

  switchTab(tab: String): void {
    this.tab = tab;
  }

  logout(event) {
    this.authService.logout();
  }

}
