import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Model } from '../../../app.models-list';
import { NotificationsService, UsersService } from '../../../app.services-list';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-usernotifications',
  templateUrl: './usernotifications.component.html',
  styleUrls: ['./usernotifications.component.scss']
})
export class UsernotificationsComponent implements OnInit {

  @ViewChild('scrollVariable') private scrollableContainer: ElementRef;

  public user: Model.User;
  public notifications = [];
  public loading = false;
  private moreContentAvailable = true;
  public infiniteScrollLoading: boolean;
  public limit: number;
  public offset: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationsService: NotificationsService,
    public usersService: UsersService,
  ) { }

  ngOnInit() {
    this.loading = true;
    const id = this.route.snapshot.paramMap.get('userId');
    this.user = new Model.User({});
    this.notifications = new Array<Model.Notification>();
    this.getUser(id);
  }

  getUser(id) {
    this.usersService.getUser(id).subscribe((res) => {
      this.user = res;
      this.notifications = res.notifications;
      this.loading = false;
    });
  }

  editNotification(id) {
    this.router.navigate(['notificationview/' + id]);
  }
}
