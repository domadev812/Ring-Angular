import { Component, OnInit } from '@angular/core';
import { MultiSelectUtil, } from '../../_utils/multiselect.util';
import { CurrentUserService, MultiSelectService, OrganizationService } from '../../app.services-list';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Model } from '../../app.models-list';
import { ToastService } from '../../_services/toast.service';

@Component({
  selector: 'app-business-signup',
  templateUrl: './business-signup.component.html',
  styleUrls: ['./business-signup.component.scss']
})
export class BusinessSignupComponent implements OnInit {
  public organizationTypeList = [];
  public ktsSelectSettings: MultiSelectUtil.ISelectSettings;
  public ktsMultiSettings: MultiSelectUtil.ISelectSettings;
  public careerGroupsList = [];
  public careers: Array<Model.Career>;
  public selectedOrganizationType = '';
  public selectedCareers = [];
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean;
  public filePreviewPath: SafeUrl;
  public organization: Model.Organization;
  public user: Model.User;
  public orgName: string;
  public contactName: string;
  public contactEmail: string;
  public scholarships = false;
  public internships = false;
  public openHouse = false;
  public jobShadowing = false;
  public other = false;
  public editFlag: boolean;
  public creating = false;


  constructor(
    private router: Router,
    private multiSelectService: MultiSelectService,
    private organizationService: OrganizationService,
    private sanitizer: DomSanitizer,
    private currentUserService: CurrentUserService,
    public toastService: ToastService
  ) { }

  ngOnInit() {
    this.ktsSelectSettings = MultiSelectUtil.singleSelection();
    this.ktsMultiSettings = MultiSelectUtil.multiSettings();
    this.organizationTypeList = MultiSelectUtil.orgType;
    this.getCareerGroups();
    this.uploader = this.organizationService.uploader;
    this.hasBaseDropZoneOver = false;
    this.organization = new Model.Organization({});
    this.user = new Model.User({});
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public selectedFile(e: any): void {
    if (this.uploader.queue.length > 1) {
      this.uploader.queue.splice(0, 1);
    }
    const fileItem = this.uploader.queue[0];
    this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
  }



  getCareerGroups(): void {
    this.multiSelectService.getDropdownCareerGroups().subscribe((res: MultiSelectUtil.SelectItem[]) => {
      this.careerGroupsList = res;
    }, err => {
      console.log('err', err);
    });
  }

  saveOrg(valid: boolean): void {
    this.organization.name = this.orgName;
    this.organization.type = this.selectedOrganizationType;
    this.user.email = this.contactEmail;

    if (!valid) {
      return;
    }
    if (!this.scholarships) {
      this.scholarships = false;
    }
    if (!this.internships) {
      this.internships = false;
    }
    if (!this.openHouse) {
      this.openHouse = false;
    }
    if (!this.jobShadowing) {
      this.jobShadowing = false;
    }
    if (!this.other) {
      this.other = false;
    }

    if (this.selectedOrganizationType.length === 0) {
      return;
    }
    if (this.selectedCareers.length === 0) {
      return;
    }

    this.createOrganization();

    let data = {
      name: this.orgName,
      email: this.contactEmail,
      contact: this.contactName,
      orgType: this.selectedOrganizationType[0]['itemName'],
      careerFields: this.selectedCareers.map(value => value.itemName).join(', '),
      scholarships: `${this.scholarships}`,
      internships: `${this.internships}`,
      openHouse: `${this.openHouse}`,
      jobShadowing: `${this.jobShadowing}`,
      other: `${this.other}`,
    };

    this.organizationService.sendData(data).subscribe((res: boolean) => {
    }, err => {
      this.toastService.showError('Server error');
      console.log(err);
    });
  }


  createOrganization(): void {
    this.creating = true;
    this.organizationService.createUserOrganization(this.organization, this.user)
      .subscribe((user: Model.User) => {
        this.handleOrganizationSuccess.bind(this)(user.organization_id);
        this.currentUserService.clearCurrentUserPromise();
        this.router.navigate(['resources']);
      }, err => {
        this.toastService.showError(err.message ? err.message : 'Server Error');
      });
    this.creating = false;
  }

  handleOrganizationSuccess(organization_id: string): void {
    if (this.uploader.queue && this.uploader.queue.length > 0) {
      this.organizationService.uploadImage(organization_id);
    }
  }

}
