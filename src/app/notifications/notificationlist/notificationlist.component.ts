import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { NotificationsService } from '../../_services/notifications.service';
import 'rxjs/add/operator/do';
import { Model } from '../../app.models-list';

@Component({
  selector: 'app-notificationlist',
  templateUrl: './notificationlist.component.html',
  styleUrls: ['./notificationlist.component.scss']
})
export class NotificationlistComponent implements OnInit {
  @ViewChild('scrollVariable') private scrollableContainer: ElementRef;
  private moreContentAvailable = true;
  public infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  notifications: Array<Model.Notification>;
  counter = 0;
  public loading = false;

  constructor(private notificationsService: NotificationsService,
    private router: Router) { }

  ngOnInit() {
    this.notifications = new Array<Model.Notification>();
    this.limit = 20;
    this.offset = 0;
    this.getNotifications();
    this.loading = true;
  }

  getNotifications(): void {
    this.notificationsService.getNotifications().subscribe((res) => {
      this.loading = false;
      this.notifications = res.map(internship => internship);
      this.offset += res.length;
    }, (errors) => {
      this.loading = false;
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;
      return this.notificationsService.getNotifications(this.offset).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res) {
    res.map(notification => {
      this.notifications.push(notification);
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }

  viewNotification(id): void {
    this.router.navigate(['notificationview/' + id]);
  }
}
