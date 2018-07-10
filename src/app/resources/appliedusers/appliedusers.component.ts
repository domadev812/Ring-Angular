import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule } from '@angular/router';
import { Model } from '../../app.models-list';
import { ResourcesService } from '../../app.services-list';
import { NavbarService } from '../../app.services-list';
import { ToastService } from '../../_services/toast.service';

@Component({
  selector: 'app-appliedusers',
  templateUrl: './appliedusers.component.html',
  styleUrls: ['./appliedusers.component.scss']
})

export class AppliedUserComponent implements OnInit {

  public resource: Model.Resource;
  public applications: Array<Model.Application>;

  constructor(
    private route: ActivatedRoute, 
    private resourcesService: ResourcesService,
    private navBarService: NavbarService,
    public toastService: ToastService
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('resources');    
    this.resource = new Model.Resource({});
    this.applications = new Array<Model.Application>();
    
    const id = this.route.snapshot.paramMap.get('resourceId');
    if (id !== null) {
      this.getApplications(id);
      this.getResource(id);
    }
  }

  getApplications(id: string): void {
    this.resourcesService.getResourceApplications(id).subscribe((res) => {
      this.applications = res;      
    }, (errors) => {
      this.toastService.showError('Server error');;
    });
  }

  getResource(id: string): void {
    this.resourcesService.getResource(id).subscribe((res) => {
      this.resource = res;
    }, (errors) => {
      this.toastService.showError('Server error');;
    });
  }
}
