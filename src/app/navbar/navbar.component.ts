import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../app.services-list';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  tab: String;

  constructor(
    private navBarService: NavbarService
  ) { }

  ngOnInit() {
    this.tab = 'Users';
  }

  switchTab(tab: String): void {
    this.tab = tab;
  }

}
