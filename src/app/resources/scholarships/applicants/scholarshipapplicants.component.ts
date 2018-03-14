import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute, 
    private resourcesService: ResourcesService,
    private navBarService: NavbarService,
  ) { }

  ngOnInit() {
    this.navBarService.show();    
    this.applications = new Array<Model.Application>();
    this.scholarship = new Model.Scholarship({});

    const id = this.route.snapshot.paramMap.get('scholarshipId');
    if (id !== null) {
      this.getApplications(id);
      this.getScholarship(id);
    }
  }

  getApplications(id: string): void {
    this.resourcesService.getScholarshipApplications(id).subscribe((res) => {
      this.applications = res;      
    }, (errors) => {
      alert('Server error');
    });
  }

  getScholarship(id: string): void {
    this.resourcesService.getScholarship(id).subscribe((res) => {      
      this.scholarship = res;           
    }, (errors) => {
      console.log('err', errors);
      alert('Server error');
    });
  }
}
