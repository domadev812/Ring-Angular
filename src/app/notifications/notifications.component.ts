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
    this.selectedTab = 'notifications';
  }

  addNotification(): void {
    this.router.navigate(['notificationadd']);
  }
}

