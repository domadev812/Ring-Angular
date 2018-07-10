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
import { Observable } from 'rxjs/Observable';
import { User } from '../../_models/user.model';
import { ToastService } from '../../_services/toast.service';

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
  public notificationId: string;

  public ktsSelectSettings: MultiSelectUtil.ISelectSettings;
  public ktsMultiSettings: MultiSelectUtil.ISelectSettings;
  public careerList = [];
  public selectedCareers = [];
  public notificationRecipientCategory: any = {};
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

  public pageState: 'new' | 'approval' | 'readonly';
  public canApprove = false;
  public isLoading = false;
  public isAdmin = false;

  constructor(private route: ActivatedRoute,
    private notificationsService: NotificationsService,
    private router: Router,
    private multiSelectService: MultiSelectService,
    private navBarService: NavbarService,
    private currentUserService: CurrentUserService,
    public authProvider: AuthService,
    public access: AccessService,
    public cdr: ChangeDetectorRef,
    public toastService: ToastService
  ) { }

  async ngOnInit(): Promise<void> {
    try {
      this.navBarService.show();
      this.navBarService.activeTabChanged('notifications');
      this.notification = new Model.Notification({});
      this.careers = new Array<Model.Career>();
      this.notificationId = this.route.snapshot.paramMap.get('notificationId');
      this.getCareers();
      this.setState();
      this.notificationRecipientCategory = MultiSelectUtil.notificationRecipientCategory;
      for (let year = this.min; year <= this.max; year++) {
        this.originalTypeValueList.push({ id: year.toString(), itemName: year.toString(), category: 'graduation_year' });
      }
    } catch (err) { }
  }

  setTitle() {
    if (this.approval()) this.title = 'Awaiting Approval';
    else if (!this.notificationId) this.title = 'New Notification';
    else this.title = 'Notification';
  }



  setMultiSelect(currentUser: User): void {
    // if (!currentUser.isAdmin()) selectSettings.disabled = true;
    this.ktsSelectSettings = MultiSelectUtil.singleSelection({ disabled: this.disabled() });
    this.ktsMultiSettings = MultiSelectUtil.selectAllMultiSettings({ disabled: this.disabled() });
    this.notificationRecipientCategory = MultiSelectUtil.singleSelection({ disabled: this.disabled() });
  }

  async setState(): Promise<void> {
    const currentUser = await this.currentUserService.getCurrentUser(this.authProvider);
    this.isAdmin = currentUser.isAdmin();
    this.canApprove = this.access.getAccess(currentUser.getRole()).functionalityAccess.approveRejectButtons;
    if (this.notificationId) await this.getNotification(this.notificationId);
    this.pageState = this.notification.getPageState(currentUser);
    this.setTitle();
    this.setMultiSelect(currentUser);
  }

  disabled(): boolean {
    return this.pageState !== 'new' && (this.pageState === 'readonly' || this.pageState === 'approval');
  }

  approval(): boolean {
    return this.pageState === 'approval';
  }

  readonly(): boolean {
    return this.pageState === 'readonly';
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
    this.multiSelectService.getDropdownCareerGroups().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.careerList = res;
    }, err => {
      console.log('err', err);
    });
  }

  async getNotification(id: string): Promise<void> {
    try {
      this.isLoading = true;
      this.notification = await this.notificationsService.getNotification(id).toPromise();
      this.isLoading = false;
      let notificationType = this.typeList.find(type => type.id === this.notification.type);
      if (!notificationType) {
        return;
      }
      this.selectedType.push(this.typeList.find(type => type.id === this.notification.type));
      if (this.notification.type === 'gender' || this.notification.type === 'graduation_year') {
        this.selectedValueList.push(this.originalTypeValueList.find(value => value.id === this.notification.resource['resource_value']));
      } else if (this.notification.type === 'careers') {
        this.selectedCareers = this.notification.resource.map(career => {
          return { id: career.id, itemName: career.title };
        });
      }
      this.changeState();
    } catch (err) {
      this.toastService.showError(err.message ? err.message : 'Server Error');
    }
    this.isLoading = false;
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


    this.notification.type_ids = this.selectedCareers.map(career_group => {
      return career_group.id;
    });

    if (this.selectedType[0]) {
      this.notification.type = this.selectedType[0].id;
      // this.notification.type = 'all';
      if (this.selectedValueList[0]) {
        this.notification.type_value = this.selectedValueList[0].id;
      } else {
        this.notification.type_value = null;
      }
    } else {
      this.notification.type = null;
    }
    this.isLoading = true;
    this.notificationsService.createNotification(this.notification).subscribe((res) => {
      this.isLoading = false;
      this.toastService.show('Created new notification successfully');
      this.router.navigate(['notifications']);
    }, (errors) => {
      this.isLoading = false;
      this.toastService.showError('Server error');;
    });
  }


  approve(): void {
    this.notificationsService.notificationApprove(this.notificationId).subscribe((res) => {
      this.isLoading = false;
      this.toastService.show('Notification Approved');
      this.router.navigate(['approvals']);
    }, err => {
      this.toastService.showError('Server error');
    });
  }

  reject(): void {
    this.notificationsService.notificationReject(this.notificationId).subscribe((res) => {
      this.isLoading = false;
      this.toastService.show('Notification Rejected');
      this.router.navigate(['approvals']);
    }, err => {
      this.toastService.showError('Server error');
    });
  }

  goBack(): void {
    this.router.navigate(['notifications']);
  }

  cancelNotification(): void {
    this.router.navigate(['notifications']);
  }
}