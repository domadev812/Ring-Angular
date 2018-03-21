import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Model } from '../../../app.models-list';
import { ResourcesService } from '../../../app.services-list';
import { NavbarService } from '../../../app.services-list';

@Component({
  selector: 'app-scholarshipapplicants',
  templateUrl: './scholarshipapplicants.component.html',
  styleUrls: ['./scholarshipapplicants.component.scss']
})

export class ScholarshipApplicantsComponent implements OnInit {
  public applications: Array<Model.Application>;
  public scholarship: Model.Scholarship;
  public creating: boolean;
  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private resourcesService: ResourcesService,
    private navBarService: NavbarService,
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.navBarService.activeTabChanged('resources');     
    this.applications = new Array<Model.Application>();
    this.scholarship = new Model.Scholarship({});
    this.creating = false;
    
    const id = this.route.snapshot.paramMap.get('scholarshipId');
    if (id !== null) {
      this.getApplications(id);
      this.getScholarship(id);
    }
  }

  getApplications(id: string): void {
    this.creating = true;
    this.resourcesService.getScholarshipApplications(id).subscribe((res) => {
      this.applications = res;       
      this.creating = false;
    }, (errors) => {
      this.creating = false;
      alert(errors.message);
    });
  }

  getScholarship(id: string): void {
    this.creating = true;
    this.resourcesService.getScholarship(id).subscribe((res) => {      
      this.scholarship = res;           
      this.creating = false;
    }, (errors) => {
      alert(errors.message);
      this.creating = false;
    });
  }

  viewApplication(application: Model.Application): void {
    if (application.in_app) {
      this.resourcesService.setApplication(application);
      this.router.navigate(['scholarshipapplication']);
    }
  }
}
