import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Routes, RouterModule } from '@angular/router';
import { Model } from '../../app.models-list';
import { ResourcesService } from '../../app.services-list';
import { NavbarService } from '../../app.services-list';

@Component({
  selector: 'app-appliedusers',
  templateUrl: './appliedusers.component.html',
  styleUrls: ['./appliedusers.component.scss']
})

export class AppliedUserComponent implements OnInit {

  public resource: Model.Resource;

  constructor(
    private route: ActivatedRoute, 
    private resourcesService: ResourcesService,
    private navBarService: NavbarService,
  ) { }

  ngOnInit() {
    this.navBarService.show();
    this.resource = new Model.Resource({});
    const id = this.route.snapshot.paramMap.get('resourceId');
    if (id !== null) {
      this.getResource(id);
    }
  }

  getResource(id: string): void {
    this.resourcesService.getResource(id).subscribe((res) => {
      this.resource = res;
    }, (errors) => {
      alert('Server error');
    });
  }
}
