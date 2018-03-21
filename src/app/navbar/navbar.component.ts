import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../app.services-list';
import * as Services from '../app.services-list';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  tab: string;
  active: boolean;
  
  public subscription: Subscription;  
  constructor(
    public navBarService: NavbarService,
    private authService: Services.AuthService
  ) { }

  ngOnInit() {
    this.subscription = this.navBarService.tabEvent.subscribe(event => this.switchTab(event));
  }

  switchTab(tab: string): void {
    this.tab = tab;
    this.navBarService.activeTab = tab;
  }

  logout(event) {
    this.authService.logout();
  }

}
