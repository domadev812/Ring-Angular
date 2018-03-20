import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule } from '@angular/router';
import { Model } from '../../../app.models-list';
import { ResourcesService } from '../../../app.services-list';
import { NavbarService } from '../../../app.services-list';

@Component({
  selector: 'app-scholarshipapplication',
  templateUrl: './scholarshipapplication.component.html',
  styleUrls: ['./scholarshipapplication.component.scss']
})

export class ScholarshipApplicationComponent implements OnInit, OnDestroy {
  public application: Model.Application;  

  constructor(
    private route: ActivatedRoute, 
    private resourcesService: ResourcesService,
    private navBarService: NavbarService,
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('resources');     
    this.application = this.resourcesService.getApplication();        
  }

  ngOnDestroy() {   
    this.resourcesService.setApplication(null); 
  }
}
