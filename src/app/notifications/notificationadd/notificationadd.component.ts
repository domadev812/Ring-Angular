import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationsService, MultiSelectService } from '../../app.services-list';
import { error } from 'util';
import { Model } from '../../app.models-list';
import { MultiSelectUtil } from '../../_utils/multiselect.util';
import { NavbarService } from '../../app.services-list';

@Component({
  selector: 'app-notificationadd',
  templateUrl: './notificationadd.component.html',
  styleUrls: ['./notificationadd.component.scss']
})
export class NotificationAddComponent implements OnInit {
  notification: Model.Notification;
  subject: string;
  public careers: Array<Model.Career>;
  public careerList = [];
  public selectedCareers = [];
  public ktsSelectSettings = {};
  public ktsMultiSettings = {};

  constructor(private route: ActivatedRoute,
    private notificationsService: NotificationsService,
    private router: Router,
    private multiSelectService: MultiSelectService,
    private navBarService: NavbarService,
  ) {
  }

  ngOnInit() {
    this.navBarService.show();
    this.notification = new Model.Notification({});
    this.careers = new Array<Model.Career>();
    this.getCareers();
    this.notification.id = this.route.snapshot.paramMap.get('notificationid');
    if (this.notification.id !== null) {
      this.subject = 'Edit Notification';
    }

    this.ktsSelectSettings = MultiSelectUtil.singleSelection;
    this.ktsMultiSettings = MultiSelectUtil.multiSettings;
  }



  onCareerSelect(item: any) {
  }
  onCareerDeSelect(item: any) {
  }

  getCareers(): void {
    this.multiSelectService.getDropdownCareers().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.careerList = res;
    }, err => {
      console.log('err', err);
    });
  }


  saveNotification(valid: boolean): void {

    if (!valid) {
      return;
    }

    this.notification.type_ids = this.selectedCareers.map(career => {
      return career.id;
    });

    if (!this.notification.subject || this.notification.subject === '') {
      alert('Please input notification name');
    } else {
      this.notificationsService.updateNotification(this.notification).subscribe((res) => {
        alert('notification is updated');
      }, (errors) => {
        alert('Server error');
      });
    }
  }
  cancelNotification(): void {
    this.router.navigate(['notifications']);
  }
}