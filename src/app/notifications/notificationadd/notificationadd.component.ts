import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NotificationsService, MultiSelectService, CurrentUserService, AuthService, AccessService } from '../../app.services-list';
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
  public ktsSelectSettings: any = {};
  public notificationRecipientCategory: any = {};
  public ktsMultiSettings: any = {};
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
  public canViewApproveReject: boolean;
  public approved: boolean;
  public showElement: boolean;
  public approveBtn: boolean;
  public saveBtn: boolean;
  public currentRoute: string;
  public currentUser: any;
  public notificationId: string;

  constructor(private route: ActivatedRoute,
    private notificationsService: NotificationsService,
    private router: Router,
    private multiSelectService: MultiSelectService,
    private navBarService: NavbarService,
    private currentUserService: CurrentUserService,
    public authProvider: AuthService,
    public access: AccessService,
    public cdr: ChangeDetectorRef
  ) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.navBarService.show();
      this.navBarService.activeTabChanged('notifications');
      this.notification = new Model.Notification({});
      this.careers = new Array<Model.Career>();
      this.notificationId = this.route.snapshot.paramMap.get('notificationId');
      this.approved = true;
      this.currentRoute = this.route.snapshot.url[0].path;
      this.currentUser = await this.currentUserService.getCurrentUser(this.authProvider);
      this.setUpForView(this.currentUser.roles);
      this.title = 'New Notification';
      this.ktsSelectSettings = MultiSelectUtil.singleSelection;
      this.ktsMultiSettings = MultiSelectUtil.multiSettings;
      this.notificationRecipientCategory = MultiSelectUtil.notificationRecipientCategory;

      this.getCareers();
      for (let year = this.min; year <= this.max; year++) {
        this.originalTypeValueList.push({ id: year.toString(), itemName: year.toString(), category: 'graduation_year' });
      }
    } catch (err) { }
  }

  setMsSettings(sDisabled: boolean = null, mDisabled: boolean = null, dDisabled: boolean = null): void {
    this.ktsSelectSettings.disabled = sDisabled;
    this.ktsMultiSettings.disabled = mDisabled;
    this.notificationRecipientCategory.disabled = dDisabled;
  }

  setTitle(title: string = null) {
    const isAdmin = this.currentUser.roles.includes('admin');
    if (title) {
      this.title = title;
    } else if (!this.approved && isAdmin) {
      this.title = this.notification.organization_name;
    } else if (this.notificationId) {
      this.title = 'View Notification';
    }
  }

  showButtonGroup() {
    const isAdmin = this.currentUser.roles.includes('admin');
    if (!this.notificationId) {
      this.approveBtn = true;
    } else if (!isAdmin && !this.notificationId) {
      this.approveBtn = false;
      this.saveBtn = true;
    } else {
      this.approveBtn = false;
      this.saveBtn = true;
    }
  }

  multiSelectPreFlight(): void {
    const isAdmin = this.currentUser.roles.includes('admin');
    this.ktsSelectSettings = MultiSelectUtil.singleSelection;
    this.ktsMultiSettings = MultiSelectUtil.multiSettings;
    this.notificationRecipientCategory = MultiSelectUtil.notificationRecipientCategory;

    if (isAdmin && this.notificationId && !this.approved) {
      this.setMsSettings(true, true, true);
    } else if (isAdmin && !this.notificationId) {
      this.setMsSettings(false, false);
    } else if (isAdmin && this.notificationId || this.approved) {
      this.setMsSettings(true, true);
    } else if (!isAdmin && !this.notificationId) {
      this.setMsSettings(true, true, true);
    }

  }

  setUpForView(roles: Array<string>): void {
    this.canViewApproveReject = this.access.getAccess(this.currentUser.getRole()).functionalityAccess.approveRejectButtons;
    const userType = roles.includes('admin') ? 'admin' : 'other';
    const selector = `${userType + '_' + this.currentRoute}`;
    const setupIndex = {
      'admin_notificationview': this.adminNotificationView.bind(this),
      'admin_notificationadd': this.adminNotificationAdd.bind(this),
      'other_notificationadd': this.userNotificationAdd.bind(this),
      'other_notificationview': this.userNotificationView.bind(this),

    };
    return setupIndex[selector]();
  }

  async adminNotificationView(): Promise<void> {
    try {
      if (this.notificationId) await this.getNotification(this.notificationId);
      if (this.approved) this.showButtonGroup();
      this.approveBtn = false;
      if (!this.approved)
        this.ktsMultiSettings.disabled = true;
      this.notificationRecipientCategory.disabled = true;
    } catch (err) { }
  }
  userNotificationView(): void {
    if (this.notificationId) this.getNotification(this.notificationId);

  }

  adminNotificationAdd(): void {
    if (!this.notificationId)
      this.multiSelectPreFlight();
    this.setTitle('New notification');
    this.showButtonGroup();
  }

  userNotificationAdd(): void {
    if (!this.notificationId)
      this.setTitle('New notification');
    this.showButtonGroup();
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
    if (!this.selectedType[0]) {
      return;
    }
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
      this.approved = res.approved;
      this.creating = false;
      this.setTitle();
      this.showButtonGroup();
      this.multiSelectPreFlight();
      let notificationType = this.typeList.find(type => type.id === res.type);
      if (!notificationType) {
        return;
      }
      this.selectedType.push(this.typeList.find(type => type.id === res.type));
      if (res.type === 'gender' || res.type === 'graduation_year') {
        this.selectedValueList.push(this.originalTypeValueList.find(value => value.id === res.resource['resource_value']));
      } else if (res.type === 'careers') {
        this.selectedCareers = res.resource.map(career => {
          return { id: career.id, itemName: career.title };
        });
      }
      this.changeState();
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


  approve(): void {
    this.notificationsService.notificationApprove(this.notificationId).subscribe((res) => {
      this.creating = false;
      alert('Notification Approved');
      this.router.navigate(['approvals']);
    }, err => {
      alert(err);
    });
  }

  reject(): void {
    this.notificationsService.notificationReject(this.notificationId).subscribe((res) => {
      this.creating = false;
      alert('Notification Rejected');
      this.router.navigate(['approvals']);
    }, err => {
      alert(err);
    });
  }

  cancelNotification(): void {
    this.router.navigate(['notifications']);
  }
}