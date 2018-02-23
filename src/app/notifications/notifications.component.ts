import 'rxjs/add/observable/throw';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  selectedTab: String;

  constructor(private router: Router) { }

  ngOnInit() {
    this.selectedTab = 'notifications';
  }

  addNotification(event): void {
    this.router.navigate(['notificationadd']);
  }
}

