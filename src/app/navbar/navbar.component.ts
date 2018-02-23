import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  tab: String;

  constructor() { }

  ngOnInit() {
    this.tab = 'Users';
  }

  switchTab(tab: String): void {
    this.tab = tab;
  }

}
