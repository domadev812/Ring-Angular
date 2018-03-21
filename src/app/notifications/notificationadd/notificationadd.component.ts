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
  public notification: Model.Notification;
  public title: string;
  public min = new Date().getFullYear();
  public max = this.min + 4;
  public careers: Array<Model.Career>;
  public careerList = [];
  public selectedCareers = [];
  public ktsSelectSettings = {};
  public ktsMultiSettings = {};
  public typeList = [{ id: 'all', itemName: 'All' },
                     { id: 'gender', itemName: 'Gender' },
                     { id: 'graduation_year', itemName: 'Graduation Year' },
                     { id: 'careers', itemName: 'Careers' }];
  public selectedType = [];
  public originalTypeValueList = [{ id: 'M', itemName: 'Male', category: 'gender' },
                                  { id: 'F', itemName: 'Female', category: 'gender' }];
  public typeValueList = [];
  public selectedValueList = [];
  public valueListTitle = '';
  public valueListVisibleFlag = false;
  public careerListVisibleFlag = false;
  public creating = false;

  constructor(private route: ActivatedRoute,
    private notificationsService: NotificationsService,
    private router: Router,
    private multiSelectService: MultiSelectService,
    private navBarService: NavbarService,
  ) {
  }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('notifications');
    this.notification = new Model.Notification({});
    this.careers = new Array<Model.Career>();    
    let notificationId = this.route.snapshot.paramMap.get('notificationId');
    this.title = 'New Notification';
    this.ktsSelectSettings = MultiSelectUtil.singleSelection;
    this.ktsMultiSettings = MultiSelectUtil.multiSettings;

    this.getCareers();
    for (let year = this.min; year <= this.max; year++) {
      this.originalTypeValueList.push({ id: year.toString(), itemName: year.toString(), category: 'graduation_year' });
    }
    
    if (notificationId) {
      this.title = 'View Notification';
      this.getNotification(notificationId);
      this.ktsSelectSettings['disabled'] = true;
      this.ktsMultiSettings['disabled'] = true;
    }
  }

  onTypeSelect(item: any) {
    this.selectedValueList = [];
    this.changeState();
  }

  onTypeDeSelect(item: any) {
    this.valueListVisibleFlag = false;
    this.careerListVisibleFlag = false;
    this.selectedValueList = [];
  }

  onValueSelect(item: any) {
  }

  onValueDeSelect(item: any) {
  }

  onCareerSelect(item: any) {
  }

  onCareerDeSelect(item: any) {
  }

  changeState(): void {
    this.valueListTitle = this.selectedType[0].itemName;
    if (this.selectedType[0].id === 'all') {
      this.valueListVisibleFlag = false;
      this.careerListVisibleFlag = false;
    } else if (this.selectedType[0].id === 'gender') {
      this.valueListVisibleFlag = true;
      this.careerListVisibleFlag = false;
      this.typeValueList = this.originalTypeValueList.filter(typeValue => typeValue.category === 'gender');
    } else if (this.selectedType[0].id === 'graduation_year') {
      this.valueListVisibleFlag = true;
      this.careerListVisibleFlag = false;
      this.typeValueList = this.originalTypeValueList.filter(typeValue => typeValue.category === 'graduation_year');
    } else if (this.selectedType[0].id === 'careers') {
      this.valueListVisibleFlag = false;
      this.careerListVisibleFlag = true;
    }
  }
  getCareers(): void {
    this.multiSelectService.getDropdownCareers().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.careerList = res;
    }, err => {
      console.log('err', err);
    });
  }

  getNotification(id: string) {
    this.creating = true;
    this.notificationsService.getNotification(id).subscribe((res) => {
      this.notification = res;
      this.selectedType.push(this.typeList.find(type => type.id === res.type));
      if (res.type === 'gender' || res.type === 'graduation_year') {
        this.selectedValueList.push(this.originalTypeValueList.find(value => value.id === res.resource['resource_value']));
      } else if (res.type === 'careers') {
        this.selectedCareers = res.resource.map(career => {
          return { id: career.id, itemName: career.title };
        });
      }
      this.changeState();
      this.creating = false;
    }, (errors) => {
      this.creating = false;
      alert('Server error');
    });
  }

  saveNotification(valid: boolean): void {
    if (!valid) {
      return;
    }

    if (this.selectedType.length === 0) {
      return;
    }

    if (this.selectedType[0].id === 'gender' || this.selectedType[0].id === 'graduation_year') {
      if (this.selectedValueList.length === 0) {
        return;
      }
    }

    this.notification.type_ids = this.selectedCareers.map(career => {
      return career.id;
    });

    if (this.selectedType[0]) {
      this.notification.type = this.selectedType[0].id;
      if (this.selectedValueList[0]) {
        this.notification.type_value = this.selectedValueList[0].id;
      } else {
        this.notification.type_value = null;
      }
    } else {
      this.notification.type = null;
    }
    this.creating = true;
    this.notificationsService.createNotification(this.notification).subscribe((res) => {
      this.creating = false;
      alert('Create new notification successfully');
      this.router.navigate(['notifications']);
    }, (errors) => {
      this.creating = false;
      alert('Server error');
    });
  }

  cancelNotification(): void {
    this.router.navigate(['notifications']);
  }
}