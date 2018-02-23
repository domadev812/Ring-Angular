import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  private infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;
  notifications: Array<Model.Notification>;
  counter = 0;

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit() {
    this.notifications = new Array<Model.Notification>();
    this.limit = 20;
    this.offset = 0;
    this.getNotifications();
  }

  getNotifications(): void {
    this.notificationsService.getNotifications('Notification', this.offset).subscribe((res) => {
      this.notifications = res.map(internship => internship);
      this.offset += res.length;
    }, (errors) => {
      alert('Server error');
    });
  }

  myScrollCallBack() {
    if (this.moreContentAvailable) {
      this.infiniteScrollLoading = true;
      return this.notificationsService.getNotifications('Notification', this.offset).do(this.infiniteScrollCallBack.bind(this));
    }
  }

  infiniteScrollCallBack(res) {
    res.map(notification => {
      this.notifications.push(notification),
        this.counter++;
    });
    this.offset += res.length;
    this.moreContentAvailable = !(res.length < this.limit);
    this.infiniteScrollLoading = false;
  }
}
