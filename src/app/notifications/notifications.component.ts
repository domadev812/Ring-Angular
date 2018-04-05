import 'rxjs/add/observable/throw';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { NavbarService } from '../app.services-list';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  selectedTab: String;

  constructor(
    private router: Router,
    private navBarService: NavbarService,
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('notifications');
    this.selectedTab = 'notifications';
  }

  addNotification(): void {
    this.router.navigate(['notificationadd']);
  }

  mouseWheelUp(): void {
    let scrollArea = document.getElementsByClassName('table-content-without-search');
    scrollArea[0].scrollTop = scrollArea[0].scrollTop - 40;
  }
  mouseWheelDown(): void {
    let scrollArea = document.getElementsByClassName('table-content-without-search');
    scrollArea[0].scrollTop = scrollArea[0].scrollTop + 40;
  }
}

