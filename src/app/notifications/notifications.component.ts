import 'rxjs/add/observable/throw';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { NavbarService, CurrentUserService, AuthService, AccessService } from '../app.services-list';
import { Model } from '../app.models-list';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  selectedTab: String;
  canCreateMessage: boolean;

  constructor(
    private router: Router,
    private navBarService: NavbarService,
    private currentUserService: CurrentUserService,
    private authProvider: AuthService,
    public access: AccessService
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('notifications');
    this.selectedTab = 'notifications';
    this.currentUserService.getCurrentUser(this.authProvider).then((user: Model.User) => {
      if (user) {
        this.canCreateMessage = this.access.getAccess(user.getRole()).functionalityAccess.newMessage;
      }
    });
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

  newMessage(): void {
    this.router.navigate(['messageboard']);
  }
}

