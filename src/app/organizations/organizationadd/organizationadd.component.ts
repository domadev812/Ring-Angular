import 'rxjs/add/observable/throw';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, Routes, RouterModule } from '@angular/router';
import { error } from 'util';
import { OrganizationService, NavbarService } from '../../app.services-list';
import { Model } from '../../app.models-list';
import { GlobalState } from '../../global.state';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from '../../../environments/environment';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-organizationadd',
  templateUrl: './organizationadd.component.html',
  styleUrls: ['./organizationadd.component.scss']
})
export class OrganizationAddComponent implements OnInit {
  public organization: Model.Organization;
  public type: string;
  public title: string;
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean;
  public isSchool = false;
  public filePreviewPath: SafeUrl;
  public testImg: string;
  public creating = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private organizationService: OrganizationService,
    private sanitizer: DomSanitizer,
    private navBarService: NavbarService) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('organizations');
    this.organization = new Model.Organization({});
    this.uploader = this.organizationService.uploader;
    this.type = this.route.snapshot.paramMap.get('type');
    const id = this.route.snapshot.paramMap.get('id');
    if (this.type === 'school') {
      this.title = 'School Details';
    } if (this.type === 'sponsor') {
      this.title = 'New Sponsor';
    } else {
      this.title = 'Sponsor Details';
    }
    this.hasBaseDropZoneOver = false;
    if (id !== null) {
      this.getOrganization(id);
    }
  }

  createOrUpdateOrganization(): void {
    this.creating = true;
    if (this.organization.id) {
      this.organizationService
        .updateOrganization(this.organization)
        .subscribe(this.handleOrganizationSuccess.bind(this));
      this.creating = false;  
      alert('Organization Updated Successfully');
      this.router.navigate(['organizations']);
    } else {
      this.organizationService
        .createOrganization(this.organization)
        .subscribe(this.handleOrganizationSuccess.bind(this));
      this.creating = false;  
      alert('Organization Created Successfully');
      this.router.navigate(['organizations']);
    }
  }

  handleOrganizationSuccess(res: Model.Organization): void {
    this.organization = res;
    if (this.uploader.queue && this.uploader.queue.length > 0) {
      this.organizationService.uploadImage(this.organization.id);
    }
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

  getOrganization(id: string): void {
    this.creating = true;
    this.organizationService.getOrganization(id).subscribe((organization: Model.Organization) => {
      this.organization = organization;
      this.filePreviewPath = this.sanitizer.bypassSecurityTrustUrl(this.organization.getImgUrl());

      if (this.organization.type === 'school') {
        this.isSchool = true;
        this.title = 'School Details';
      }
      this.creating = false;
    }, (errors) => {
      this.creating = false;
      alert('Server error');
    });
  }

  saveOrganization(valid): void {
    if (!valid) {
      return;
    } else if (!this.validURL(this.organization.url)) {
      return;
    } else {
      this.organization.type = this.type || this.organization.type;
      this.createOrUpdateOrganization();
    }
  }

  goBack(event): void {
    this.router.navigate(['organizations']);
  }

  validURL(url: string) {
    // tslint:disable-next-line:max-line-length
    const pattern = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return pattern.test(url);
  }
}
