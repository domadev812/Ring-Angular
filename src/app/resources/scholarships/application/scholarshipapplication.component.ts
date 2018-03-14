import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule } from '@angular/router';
import { Model } from '../../../app.models-list';
import { ResourcesService } from '../../../app.services-list';
import { NavbarService } from '../../../app.services-list';

@Component({
  selector: 'app-scholarshipapplication',
  templateUrl: './scholarshipapplication.component.html',
  styleUrls: ['./scholarshipapplication.component.scss']
})

export class ScholarshipApplicationComponent implements OnInit {
  public application: Model.Application;  

  constructor(
    private route: ActivatedRoute, 
    private resourcesService: ResourcesService,
    private navBarService: NavbarService,
  ) { }

  ngOnInit() {
    this.navBarService.show();    
    this.application = new Model.Application();    

    const id = this.route.snapshot.paramMap.get('applicationId');
    if (id !== null) {
      this.getApplication(id);      
    }
  }

  getApplication(id: string): void {
    // this.resourcesService.getScholarshipApplications(id).subscribe((res) => {
    //   this.applications = res;      
    // }, (errors) => {
    //   alert('Server error');
    // });
  }
}
